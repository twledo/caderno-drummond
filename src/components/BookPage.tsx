import { memo } from "react";
import ContentBlock, { ImageSlot } from "./ContentBlock";
import TableOfContents from "./TableOfContents";

const SIDES = {
  left: { round: "rounded-l-[3px]", shadow: "shadow-[inset_-10px_0_20px_-14px_rgb(0_0_0/0.25)]", foot: "left-4 sm:left-5" },
  right: { round: "rounded-r-[3px]", shadow: "shadow-[inset_10px_0_20px_-14px_rgb(0_0_0/0.25)]", foot: "right-4 sm:right-5" },
  single: { round: "rounded-[3px]", shadow: "shadow-[inset_10px_0_20px_-14px_rgb(0_0_0/0.25)]", foot: "right-4 sm:right-5" },
};

const PAD_X = "px-6 sm:px-8 lg:px-10";
const MONO = "font-mono uppercase";

function Cover({ book }) {
  return (
    <div className="flex h-full flex-col justify-between border-[10px] border-capa-escura bg-capa bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.35),transparent_45%),repeating-linear-gradient(0deg,rgb(0_0_0/0.05)_0_1px,transparent_1px_3px)] p-6 text-tinta shadow-[inset_0_0_0_2px_rgb(42_157_143/0.45)] sm:p-8">
      <div>
        {book.eyebrow && (
          <div className={`${MONO} text-[11px] tracking-[0.2em] text-dourado`}>{book.eyebrow}</div>
        )}
        <h1 className="mb-1.5 mt-3 whitespace-pre-line font-titulo text-3xl font-black leading-[1.02] [text-shadow:0_1px_0_rgb(255_255_255/0.6)] lg:text-5xl">
          {book.title}
        </h1>
        {book.subtitle && (
          <p className="max-w-80 font-titulo text-sm font-semibold italic text-tinta-vermelha lg:text-base">
            {book.subtitle}
          </p>
        )}
        {book.nameField && (
          <div className="mt-3.5 border-b border-dashed border-dourado pb-1 font-mono text-[11px] text-tinta">
            {book.nameField}
          </div>
        )}
      </div>

      {book.calls?.length > 0 && (
        <ul className="font-mono text-[11px] leading-[1.9] text-tinta/90 lg:text-[11.5px]">
          {book.calls.map((call) => (
            <li key={call}>
              <span className="mr-2 text-dourado">—</span>
              {call}
            </li>
          ))}
        </ul>
      )}

      {book.footer && (
        <div className="flex items-center justify-between border-t border-dourado/35 pt-3 font-mono text-[11px] tracking-[0.08em] text-dourado">
          <span>{book.footer[0]}</span>
          <span>{book.footer[1]}</span>
        </div>
      )}
    </div>
  );
}

function BackCover({ book }) {
  const back = book.backCover;
  if (!back) return null;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3.5 border-[10px] border-capa-escura bg-capa p-6 text-center text-tinta shadow-[inset_0_0_0_2px_rgb(42_157_143/0.45)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dourado font-titulo text-xl font-black text-dourado">
        {back.seal}
      </div>
      <div className="font-titulo text-base font-semibold italic">{back.name}</div>
      <p className="max-w-72 whitespace-pre-line font-mono text-xs tracking-[0.08em] text-tinta-vermelha">{back.text}</p>
    </div>
  );
}

function LeafContent({ leaf, side, onSelect, runningTitle }) {
  switch (leaf.type) {
    case "cover":
      return <Cover book={leaf.book} />;

    case "back":
      return <BackCover book={leaf.book} />;

    case "toc":
      return <TableOfContents entries={leaf.entries} onSelect={onSelect} />;

    case "page": {
      const { page, number } = leaf;
      const first = page.blocks[0];
      const dropCapFirst = typeof first === "string" || first?.type === "paragraph";
      return (
        <div className="relative flex h-full flex-col font-corpo text-tinta">
          <div className={`${MONO} flex justify-between px-6 pt-4 text-[8.5px] tracking-[0.14em] text-tinta/50 sm:px-8 lg:px-10`}>
            <span>{page.chapterEyebrow}</span>
            <span>{runningTitle}</span>
          </div>

          <div
            className={`flex flex-1 flex-col overflow-y-auto ${PAD_X} pb-10 pt-4 text-[13px] leading-[1.55] lg:pt-5 lg:text-[14px]`}
          >
            <p
              className={`${MONO} flex items-center gap-2 text-[10.5px] tracking-[0.14em] text-tinta-vermelha before:h-px before:w-4 before:bg-tinta-vermelha`}
            >
              {page.kicker ?? page.eyebrow}
            </p>

            <h2 className="mb-2.5 mt-1.5 font-titulo text-2xl font-semibold italic leading-[1.15] text-tinta">
              {page.title}
            </h2>

            {page.source && <p className="-mt-1 mb-3 font-mono text-[10px] tracking-[0.04em] text-verde-mata">{page.source}</p>}

            {page.description && <p className="mb-2 text-[0.95em] italic text-tinta/80">{page.description}</p>}

            {page.blocks.map((block, index) => (
              <ContentBlock key={`${page.id}-${index}`} block={block} dropCap={index === 0 && dropCapFirst} />
            ))}

            {page.image && (
              <ImageSlot
                src={page.image}
                alt={page.imageAlt}
                className="mt-3 min-h-56 flex-1 !rounded-sm !border-2 !border-tinta/70 bg-papel p-1"
                imgClass="object-contain"
              />
            )}
          </div>

          <footer className={`absolute bottom-3.5 font-mono text-[9.5px] tracking-[0.1em] text-tinta/50 ${SIDES[side].foot}`}>
            {String(number).padStart(2, "0")}
          </footer>
        </div>
      );
    }

    default:
      return null; // folha em branco
  }
}

/**
 * Uma folha do livro (papel, cantos, sombra da lombada) com o conteúdo dentro.
 * `side`: "left" | "right" | "single" (uma página só, no celular).
 * `shade`: "front" | "back" | undefined — escurecimento durante a virada.
 */
function BookPage({ leaf, side, shade, onSelect, runningTitle = "" }) {
  const { round, shadow } = SIDES[side];
  const isCover = leaf.type === "cover" || leaf.type === "back";

  return (
    <div
      className={`relative h-full overflow-hidden shadow-2xl ${round} ${
        isCover ? "bg-capa" : `bg-papel ${shadow}`
      }`}
    >
      <LeafContent leaf={leaf} side={side} onSelect={onSelect} runningTitle={runningTitle} />
      {shade && <div className={`leaf-shade leaf-shade--${shade}`} />}
    </div>
  );
}

export default memo(BookPage);
