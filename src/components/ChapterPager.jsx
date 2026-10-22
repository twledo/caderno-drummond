import { memo } from "react";

const buttonClass =
  "group flex min-w-0 flex-1 flex-col rounded-lg px-4 py-3 text-left ring-1 ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none";

function ChapterPager({ previous, next, onSelect }) {
  return (
    <nav aria-label="Navegação entre capítulos" className="mt-16 flex gap-3 border-t border-slate-200 pt-8">
      {previous ? (
        <button type="button" className={buttonClass} onClick={() => onSelect(previous.id)}>
          <span className="text-sm text-slate-500">Capítulo anterior</span>
          <span className="truncate font-serif text-base text-slate-900">{previous.title}</span>
        </button>
      ) : (
        <span className="flex-1" />
      )}

      {next ? (
        <button type="button" className={`${buttonClass} items-end text-right`} onClick={() => onSelect(next.id)}>
          <span className="text-sm text-slate-500">Próximo capítulo</span>
          <span className="max-w-full truncate font-serif text-base text-slate-900">{next.title}</span>
        </button>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}

export default memo(ChapterPager);