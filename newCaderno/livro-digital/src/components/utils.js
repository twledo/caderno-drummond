/** Tempo entre viradas automáticas de página (em milissegundos). */
export const AUTO_ADVANCE_MS = 10_000;

/** Folha em branco (usada quando um livro tem número ímpar de folhas). */
export const BLANK_LEAF = { id: "blank", type: "blank" };

/** Respeita a configuração "reduzir movimento" do sistema operacional. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Alinha um índice ao início da visualização (par no modo duas páginas). */
export const alignTo = (index, perView) => index - (index % perView);


/** Estimativa de linhas por página para capítulos com `flow: true` (texto corrido). */
const FLOW_CHARS_PER_LINE = 58;
const FLOW_LINES_FIRST = 46; // página de abertura (tem título e fonte)
const FLOW_LINES_NEXT = 48;

const blockText = (block) => (typeof block === "string" ? block : block.text ?? "").replace(/\*/g, "");
const linesOf = (text, perLine = FLOW_CHARS_PER_LINE) => Math.ceil(text.length / perLine);

/** Custo estimado de um bloco, em linhas. */
function blockCost(block) {
  if (typeof block !== "string" && block.type === "heading") return 2.5;
  if (typeof block !== "string" && block.type === "image") return 10;
  if (typeof block !== "string" && block.type === "list") {
    return block.items.reduce((sum, item) => sum + linesOf(blockText(item), FLOW_CHARS_PER_LINE - 4) + 0.5, 0);
  }
  return linesOf(blockText(block)) + 0.6;
}

/** Divide uma lista em itens soltos para poder quebrar entre páginas. */
function splitBlock(block) {
  if (typeof block !== "string" && block.type === "list") {
    return block.items.map((item) => ({ ...block, items: [item] }));
  }
  return [block];
}

/**
 * Distribui os blocos de um capítulo `flow` em páginas: as seções vão uma
 * abaixo da outra e só viram de página quando o espaço acaba.
 * Retorna [{ blocks, sectionIds }].
 */
function paginateFlow(chapter) {
  const pages = [{ blocks: [], sectionIds: [], used: 0 }];
  const place = (block, sectionId) => {
    for (const piece of splitBlock(block)) {
      let page = pages[pages.length - 1];
      const limit = pages.length === 1 ? FLOW_LINES_FIRST : FLOW_LINES_NEXT;
      const cost = blockCost(piece);
      const needed = piece.type === "heading" ? cost + 5 : cost; // título não fica sozinho no fim da página
      if (page.used + needed > limit && page.blocks.length > 0) {
        page = { blocks: [], sectionIds: [], used: 0 };
        pages.push(page);
      }
      if (sectionId && !page.sectionIds.includes(sectionId)) page.sectionIds.push(sectionId);
      // Itens de lista seguidos na mesma página voltam a formar uma só lista.
      const last = page.blocks[page.blocks.length - 1];
      if (piece.type === "list" && last?.type === "list") last.items = [...last.items, ...piece.items];
      else page.blocks.push(piece);
      page.used += cost;
    }
  };
  (chapter.intro ?? []).forEach((block) => place(block));
  chapter.sections.forEach((section) => {
    let first = true;
    section.content.forEach((block) => {
      place(block, first ? section.id : undefined);
      first = false;
    });
  });
  return pages;
}

/**
 * Converte o objeto `book` em uma lista de "folhas" (páginas físicas):
 *   0 → capa · 1 → sumário · 2… → uma folha de abertura por capítulo
 *   e uma folha por seção · última → contracapa. Cada folha tem um `id` único.
 */
export function buildBook(book) {
  const FIRST_CONTENT_LEAF = 2; // capa + sumário
  const contentPages = [];
  const entries = [];

  book.chapters.forEach((chapter, chapterIndex) => {
    const eyebrow = chapter.eyebrow ?? `Capítulo ${chapterIndex + 1}`;
    const base = { chapterEyebrow: eyebrow, chapterTitle: chapter.title };

    entries.push({
      id: chapter.id,
      label: chapter.eyebrow,
      title: chapter.title,
      level: 0,
      leafIndex: FIRST_CONTENT_LEAF + contentPages.length,
      pageNumber: contentPages.length + 1,
    });
    contentPages.push({
      ...base,
      id: `${chapter.id}-abertura`,
      isChapterStart: true,
      eyebrow,
      kicker: chapter.kicker ?? null,
      source: chapter.source ?? null,
      title: chapter.title,
      description: null,
      image: chapter.image ?? null,
      imageAlt: chapter.title,
      blocks: chapter.intro ?? [],
    });

    if (chapter.flow) {
      const flowPages = paginateFlow(chapter);
      contentPages.pop(); // descarta a abertura padrão: o fluxo cria as páginas
      flowPages.forEach((flowPage, i) => {
        const pageNumber = contentPages.length + 1;
        flowPage.sectionIds.forEach((sectionId) => {
          const section = chapter.sections.find((s) => s.id === sectionId);
          entries.push({
            id: sectionId,
            title: section.tocTitle ?? section.title,
            level: 1,
            leafIndex: FIRST_CONTENT_LEAF + contentPages.length,
            pageNumber,
          });
        });
        contentPages.push({
          ...base,
          id: i === 0 ? `${chapter.id}-abertura` : `${chapter.id}-${i + 1}`,
          isChapterStart: i === 0,
          eyebrow,
          kicker: i === 0 ? chapter.kicker ?? null : null,
          source: i === 0 ? chapter.source ?? null : null,
          title: chapter.title,
          description: null,
          image: i === 0 ? chapter.image ?? null : null,
          imageAlt: chapter.title,
          blocks: flowPage.blocks,
        });
      });
      return;
    }

    chapter.sections.forEach((section) => {
      // Seção que é só uma imagem: a imagem vai no fim da página, sob título e descrição.
      const only = section.content.length === 1 && section.content[0]?.type === "image" ? section.content[0] : null;
      entries.push({
        id: section.id,
        title: section.tocTitle ?? section.title,
        level: 1,
        leafIndex: FIRST_CONTENT_LEAF + contentPages.length,
        pageNumber: contentPages.length + 1,
      });
      contentPages.push({
        ...base,
        id: section.id,
        isChapterStart: false,
        eyebrow: section.eyebrow ?? eyebrow,
        kicker: null,
        source: section.source ?? null,
        title: section.title,
        description: section.description ?? null,
        image: only ? only.src : section.image ?? null,
        imageAlt: only?.alt ?? section.title,
        blocks: only ? [] : section.content,
      });
    });
  });

  const leaves = [
    { id: "cover", type: "cover", book },
    { id: "toc", type: "toc", entries },
    ...contentPages.map((page, index) => ({
      id: page.id,
      type: "page",
      page,
      number: index + 1,
    })),
  ];
  // A contracapa fica sempre na última folha (lado direito no modo duas páginas).
  if ((leaves.length + 1) % 2 !== 0) leaves.push({ id: "blank-end", type: "blank" });
  leaves.push({ id: "back-cover", type: "back", book });

  return { leaves };
}
