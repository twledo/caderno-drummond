import { memo, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import BookPage from "./BookPage";
import BookControls from "./BookControls";
import { useMediaQuery } from "./useMediaQuery";
import { AUTO_ADVANCE_MS, BLANK_LEAF, alignTo, buildBook, prefersReducedMotion } from "./utils";

/**
 * Estado da paginação (índices são de "folhas", não de capítulos):
 *   page → primeira folha visível quando nada está animando
 *   flip → { from, to } enquanto uma folha está virando
 */
function reducer(state, action) {
  switch (action.type) {
    case "GO": {
      const { per, max } = action;
      const current = alignTo(state.flip ? state.flip.to : state.page, per);
      const raw = action.to ?? current + action.delta * per;
      const target = alignTo(Math.min(Math.max(raw, 0), max), per);
      if (target === current) return state;

      // Sem animação (movimento reduzido) ou clique durante uma virada: vai direto.
      if (!action.animate || state.flip) return { page: target, flip: null };

      return { page: state.page, flip: { from: alignTo(state.page, per), to: target } };
    }
    case "END":
      return state.flip ? { page: state.flip.to, flip: null } : state;
    default:
      return state;
  }
}

const SLOT_CLASS = { left: "left-0 w-1/2", right: "right-0 w-1/2", single: "inset-x-0" };
const FACE_STYLE = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
const BACK_FACE_STYLE = { ...FACE_STYLE, transform: "rotateY(180deg)" };

function DigitalBook({ book }) {
  const { leaves } = useMemo(() => buildBook(book), [book]);
  const isSpread = useMediaQuery("(min-width: 768px)"); // duas páginas no desktop
  const per = isSpread ? 2 : 1;
  const lastLeaf = leaves.length - 1;
  const at = (index) => leaves[index] ?? BLANK_LEAF;

  const [state, dispatch] = useReducer(reducer, { page: 0, flip: null });
  const [isPlaying, setIsPlaying] = useState(true);
  const { flip } = state;

  const current = alignTo(flip ? flip.to : state.page, per);
  const atEnd = current + per > lastLeaf;

  const go = useCallback(
    (payload) =>
      dispatch({ type: "GO", per, max: lastLeaf, animate: !prefersReducedMotion(), ...payload }),
    [per, lastLeaf]
  );

  const handleSelect = useCallback((leafIndex) => go({ to: leafIndex }), [go]);
  const handlePrev = useCallback(() => go({ delta: -1 }), [go]);
  const handleNext = useCallback(() => go({ delta: 1 }), [go]);
  const handleOpenToc = useCallback(() => go({ to: 1 }), [go]);
  const handleFlipEnd = useCallback((event) => {
    if (event.target === event.currentTarget) dispatch({ type: "END" });
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!isPlaying && atEnd) go({ to: 0 }); // retomar no fim recomeça do início
    setIsPlaying((value) => !value);
  }, [isPlaying, atEnd, go]);

  // Virada automática: reinicia a contagem a cada mudança de página.
  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setTimeout(() => {
      if (atEnd) go({ to: 0 }); // no fim, volta ao começo de tudo
      else go({ delta: 1 });
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [isPlaying, current, atEnd, go]);

  // Ao começar a escrever num campo, a passagem automática pausa.
  useEffect(() => {
    const onFocusIn = (event) => {
      if (event.target instanceof Element && event.target.closest("[contenteditable]")) setIsPlaying(false);
    };
    window.addEventListener("focusin", onFocusIn);
    return () => window.removeEventListener("focusin", onFocusIn);
  }, []);

  // Setas do teclado viram a página.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof Element && event.target.closest("[contenteditable]")) return;
      if (event.key === "ArrowRight") go({ delta: 1 });
      else if (event.key === "ArrowLeft") go({ delta: -1 });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  // Decide o que aparece em cada camada.
  //  · parado: folha esquerda + folha direita
  //  · virando: por baixo ficam as páginas de "antes" (esq.) e "depois" (dir.);
  //    por cima gira uma folha com frente (dir. de antes) e verso (esq. de depois).
  //    Voltar uma página é a mesma animação tocada ao contrário.
  let leftLeaf = null;
  let mainLeaf;
  let frontLeaf = null;
  let backLeaf = null;

  if (flip) {
    const a = Math.min(flip.from, flip.to);
    const b = Math.max(flip.from, flip.to);
    if (isSpread) {
      leftLeaf = at(a);
      mainLeaf = at(b + 1);
      frontLeaf = at(a + 1);
      backLeaf = at(b);
    } else {
      mainLeaf = at(b);
      frontLeaf = at(a);
    }
  } else {
    const start = alignTo(state.page, per);
    if (isSpread) leftLeaf = at(start);
    mainLeaf = at(isSpread ? start + 1 : start);
  }

  const mainSide = isSpread ? "right" : "single";
  const isReverse = flip ? flip.to < flip.from : false;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-mesa">
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 pb-16 pt-4 sm:px-8 sm:pt-6">
        {/* Proporção A4: deitada (297×210) com duas páginas, em pé (210×297) no celular. */}
        <div
          className="relative"
          style={{
            perspective: "2400px",
            aspectRatio: isSpread ? "297 / 210" : "210 / 297",
            width: isSpread
              ? "min(100%, calc((100dvh - 6rem) * 297 / 210))"
              : "min(100%, calc((100dvh - 6rem) * 210 / 297))",
          }}
        >
          {leftLeaf && (
            <div className={`absolute inset-y-0 ${SLOT_CLASS.left}`}>
              <BookPage key={leftLeaf.id} leaf={leftLeaf} side="left" onSelect={handleSelect} runningTitle={book.runningTitle} />
            </div>
          )}

          <div className={`absolute inset-y-0 ${SLOT_CLASS[mainSide]}`}>
            <BookPage key={mainLeaf.id} leaf={mainLeaf} side={mainSide} onSelect={handleSelect} runningTitle={book.runningTitle} />
          </div>

          {flip && (
            <div
              key={`${flip.from}-${flip.to}`}
              className={`page-leaf ${isSpread ? "page-leaf--spread" : "page-leaf--single"} ${
                isReverse ? "page-leaf--reverse" : ""
              }`}
              onAnimationEnd={handleFlipEnd}
            >
              <div className="absolute inset-0" style={FACE_STYLE}>
                <BookPage leaf={frontLeaf} side={mainSide} onSelect={handleSelect} runningTitle={book.runningTitle} />
              </div>
              {isSpread && (
                <div className="absolute inset-0" style={BACK_FACE_STYLE}>
                  <BookPage leaf={backLeaf} side="left" onSelect={handleSelect} runningTitle={book.runningTitle} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <BookControls
        canPrev={current > 0}
        canNext={!atEnd}
        isPlaying={isPlaying}
        progressKey={current}
        onPrev={handlePrev}
        onNext={handleNext}
        onTogglePlay={handleTogglePlay}
        onOpenToc={handleOpenToc}
      />
    </div>
  );
}

export default memo(DigitalBook);