import { memo } from "react";
import ContentBlock from "./ContentBlock";
import ChapterPager from "./ChapterPager";
import { getSectionAnchorId } from "./utils";

function ChapterContent({ chapter, chapterNumber, previous, next, onSelectChapter }) {
  return (
    <article className="mx-auto max-w-2xl px-5 py-10 font-serif text-lg leading-8 text-slate-800 sm:px-8 lg:py-16">
      <header className="mb-10">
        <p className="font-sans text-sm text-slate-500">Capítulo {chapterNumber}</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
          {chapter.title}
        </h2>
      </header>

      {chapter.intro?.map((block, index) => (
        <ContentBlock key={`intro-${index}`} block={block} />
      ))}

      {chapter.sections.map((section) => (
        <section
          key={section.id}
          id={getSectionAnchorId(section.id)}
          className="mt-12 scroll-mt-20 lg:scroll-mt-8"
        >
          <h3 className="text-2xl font-semibold leading-snug text-slate-900">{section.title}</h3>
          {section.content.map((block, index) => (
            <ContentBlock key={`${section.id}-${index}`} block={block} />
          ))}
        </section>
      ))}

      <ChapterPager previous={previous} next={next} onSelect={onSelectChapter} />
    </article>
  );
}

export default memo(ChapterContent);