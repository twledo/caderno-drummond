import { memo, useState } from "react";
import { asset } from "./utils";

/** Negrito e itálico inline: **negrito**, *itálico*. */
function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

const MONO_LABEL = "block font-mono uppercase tracking-[0.08em]";

/** Imagem com marcador tracejado enquanto o arquivo não existe em public/imagens/. */
export function ImageSlot({ src, alt, className = "", imgClass = "object-cover" }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded border border-papel-sombra bg-white ${className}`}
    >
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[repeating-linear-gradient(135deg,#fff_0_10px,#fbeef2_10px_20px)] p-3 text-center font-mono text-[9.5px] text-tinta/75">
          <span>📎 coloque aqui o arquivo</span>
          <strong>{src.replace(/^\//, "")}</strong>
        </div>
      ) : (
        <img src={asset(src)} alt={alt ?? ""} loading="lazy" onError={() => setFailed(true)} className={`h-full w-full ${imgClass}`} />
      )}
    </div>
  );
}

function Field({ placeholder, large, className = "", style }) {
  return (
    <div
      className={`campo-escrita ${large ? "campo-escrita--bloco" : ""} ${className}`}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={large ? "true" : "false"}
      aria-label={placeholder}
      data-placeholder={placeholder}
      style={style}
    />
  );
}

/**
 * Renderiza um bloco de conteúdo. Aceita string (parágrafo) ou objeto tipado.
 * Para criar um novo tipo de bloco, adicione um `case` aqui e documente
 * o formato em BookData.js.
 */
function ContentBlock({ block, dropCap = false }) {
  const data = typeof block === "string" ? { type: "paragraph", text: block } : block;

  switch (data.type) {
    case "heading":
      return (
        <h3 className="mb-1 mt-4 font-titulo text-[1.1em] font-semibold italic leading-snug text-tinta">
          <Inline text={data.text} />
        </h3>
      );

    case "quote":
      return (
        <blockquote className="my-5 border-l-2 border-tinta-vermelha pl-5 sm:pl-6">
          <p className="text-base italic leading-7 text-tinta">{data.text}</p>
          {data.author && (
            <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-tinta-vermelha">
              {data.author}
            </footer>
          )}
        </blockquote>
      );

    case "list":
      return (
        <ul className="my-4 list-disc space-y-1.5 pl-6 marker:text-dourado">
          {data.items.map((item) => (
            <li key={item} className="pl-1">
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <aside className="my-4 rounded border border-dashed border-dourado bg-dourado/10 px-3 py-2.5">
          {data.title && (
            <p className={`${MONO_LABEL} mb-1 text-[9px] tracking-[0.1em] text-tinta-vermelha`}>{data.title}</p>
          )}
          <p className="text-[0.92em] leading-6">{data.text}</p>
        </aside>
      );

    case "activity": {
      const paragraphs = data.text == null ? [] : [].concat(data.text);
      return (
        <aside className="my-3 rounded border border-dashed border-dourado bg-dourado/10 px-3 py-2.5">
          <span className={`${MONO_LABEL} mb-1.5 text-[9px] tracking-[0.1em] text-tinta-vermelha`}>
            {data.title ?? "Atividade"}
          </span>
          {paragraphs.map((text) => (
            <p key={text} className="mb-1.5 text-[0.92em] leading-6">
              {text}
            </p>
          ))}
          {data.items && (
            <ul className="ml-4 mt-1 list-disc text-[0.92em] leading-[1.45] marker:text-dourado">
              {data.items.map((item) => (
                <li key={item} className="mb-0.5">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </aside>
      );
    }

    case "field":
      return (
        <div className="mt-3">
          {data.label && (
            <span className={`${MONO_LABEL} mb-0.5 text-[9.5px] text-verde-mata`}>{data.label}</span>
          )}
          <Field placeholder={data.placeholder} large={data.large} />
        </div>
      );

    case "fieldGroup":
      return (
        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {data.fields.map((field) => (
            <div key={field.title} className="flex flex-col rounded border border-papel-sombra p-2">
              <span className={`${MONO_LABEL} mb-1.5 text-[9px] tracking-[0.06em] text-tinta-vermelha`}>
                {field.title}
              </span>
              <Field placeholder={field.placeholder} className="min-h-24 flex-1 !text-[10.5px]" />
            </div>
          ))}
        </div>
      );

    case "imageGrid":
      return (
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {data.images.map((image, index) => (
            <ImageSlot
              key={image.src}
              src={image.src}
              alt={image.alt}
              className={`aspect-square ${data.images.length % 4 === 1 && index === 4 ? "col-span-2" : ""}`}
            />
          ))}
        </div>
      );

    case "post":
      return (
        <div className="mx-auto mt-2 w-56 overflow-hidden rounded-lg border border-papel-sombra bg-white shadow-md">
          <div className="flex items-center gap-2 px-2.5 py-2 font-mono text-[9px] text-tinta">
            <div className="h-5 w-5 shrink-0 rounded-full bg-capa" />
            {data.user}
          </div>
          <ImageSlot src={data.src} alt={data.alt} className="aspect-square w-full !rounded-none !border-0" />
          <div className="px-2.5 py-2">
            <Field placeholder={data.captionPlaceholder ?? "legenda..."} className="!text-[11px]" />
            <Field placeholder={data.tagsPlaceholder ?? "#hashtags"} className="mt-1 !text-[10px] !text-verde-mata" />
          </div>
        </div>
      );

    case "credits":
      return (
        <dl className="mt-1">
          {data.items.map((item) => (
            <div key={item.term}>
              <dt className={`${MONO_LABEL} mt-2.5 text-[9.5px] tracking-[0.1em] text-tinta-vermelha`}>{item.term}</dt>
              <dd className="mt-0.5">{item.text}</dd>
            </div>
          ))}
        </dl>
      );

    case "image":
      return (
        <figure className="my-3">
          <ImageSlot
            src={data.src}
            alt={data.alt}
            className={`mx-auto w-full ${data.full ? "h-[30rem] bg-papel" : data.compact ? "h-52" : "h-64"}`}
            imgClass={data.full ? "object-contain" : "object-cover"}
          />
          {data.caption && (
            <figcaption className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-verde-mata">
              {data.caption}
            </figcaption>
          )}
        </figure>
      );

    case "paragraph":
    default:
      return <p className={`my-2.5 ${dropCap ? "capitular" : ""}`}><Inline text={data.text} /></p>;
  }
}

export default memo(ContentBlock);
