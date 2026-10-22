import { memo } from "react";
import { AUTO_ADVANCE_MS } from "./utils";

const buttonClass =
  "rounded-full p-2.5 border border-dourado/40 bg-white/5 text-dourado-claro transition-colors hover:bg-dourado/25 disabled:opacity-30 disabled:hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado";

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/** Controles mínimos: anterior · sumário · pausar/retomar · próxima, e uma linha de tempo. */
function BookControls({ canPrev, canNext, isPlaying, progressKey, onPrev, onNext, onTogglePlay, onOpenToc }) {
  return (
    <>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <button type="button" className={buttonClass} onClick={onPrev} disabled={!canPrev} aria-label="Página anterior">
          <Icon><path d="M15 18l-6-6 6-6" /></Icon>
        </button>
        <button type="button" className={buttonClass} onClick={onOpenToc} aria-label="Ir para o sumário">
          <Icon><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></Icon>
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pausar passagem automática" : "Ativar passagem automática"}
        >
          {isPlaying ? <Icon><path d="M9 5v14M15 5v14" /></Icon> : <Icon><path d="M7 4.5v15l12-7.5z" /></Icon>}
        </button>
        <button type="button" className={buttonClass} onClick={onNext} disabled={!canNext} aria-label="Próxima página">
          <Icon><path d="M9 6l6 6-6 6" /></Icon>
        </button>
      </div>

      {isPlaying && (
        <div
          key={progressKey}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-dourado"
          style={{ animation: `page-progress ${AUTO_ADVANCE_MS}ms linear forwards` }}
        />
      )}
    </>
  );
}

export default memo(BookControls);