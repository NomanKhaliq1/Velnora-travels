import { Fragment } from "react";

/**
 * Renders editable copy: a new line becomes <br>, and *words* get the accent style.
 * "Curated *Vacation* Collections" -> Curated <span class=accent>Vacation</span> Collections
 */
export function RichText({
  text,
  accentClassName,
  breakClassName,
}: {
  text: string;
  accentClassName?: string;
  breakClassName?: string;
}) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br className={breakClassName} />}
          {line.split(/(\*[^*]+\*)/g).map((part, j) =>
            part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
              <span key={j} className={accentClassName}>
                {part.slice(1, -1)}
              </span>
            ) : (
              <Fragment key={j}>{part}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}
