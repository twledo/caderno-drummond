import { memo } from "react";

/** Sumário impresso numa página do livro. Cada linha leva à página indicada. */
function TableOfContents({ entries, onSelect }) {
  return (
    <nav
      aria-label="Sumário"
      className="relative h-full overflow-hidden bg-papel px-10 py-8 text-tinta"
    >
      <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-tinta-vermelha before:h-px before:w-4 before:bg-tinta-vermelha">
        Nesta edição
      </p>
      <h2 className="mb-3 mt-1.5 font-titulo text-2xl font-semibold italic leading-tight text-tinta">Sumário</h2>

      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelect(entry.leafIndex)}
              className={`flex w-full items-baseline gap-2 border-b border-dotted border-papel-sombra py-[3px] text-left font-mono transition-colors hover:text-tinta-vermelha focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta-vermelha motion-reduce:transition-none ${
                entry.level === 0 ? "text-[11.5px]" : "pl-5 text-[10.5px] opacity-80"
              }`}
            >
              <span>{entry.title}</span>
              <span className="min-w-4 flex-1" aria-hidden="true" />
              <span className="tabular-nums opacity-60">{String(entry.pageNumber).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default memo(TableOfContents);
