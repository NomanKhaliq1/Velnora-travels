export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type SelectOptions = Record<string, { value: string; label: string }[]>;

export const isRecord = (value: unknown): value is Record<string, Json> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Combines every item of a collection into one "shape", so the editor knows what a new
 * itinerary day or FAQ looks like even when the item being edited has an empty list.
 */
export function mergeTemplate(values: unknown[]): Json {
  const present = values.filter((v) => v !== undefined && v !== null) as Json[];
  if (present.length === 0) return "";
  if (present.some(Array.isArray)) {
    const items = present.filter(Array.isArray).flat() as Json[];
    return items.length ? [mergeTemplate(items)] : [];
  }
  const records = present.filter(isRecord);
  if (records.length) {
    const keys = [...new Set(records.flatMap((record) => Object.keys(record)))];
    return Object.fromEntries(keys.map((key) => [key, mergeTemplate(records.map((record) => record[key]))]));
  }
  return present[0];
}

export function blank(template: Json): Json {
  if (Array.isArray(template)) return [];
  if (isRecord(template)) return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, blank(value)]));
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  return "";
}

/** ["content", 3, "type"] -> "content[].type", used to look up select options. */
export function pathPattern(path: (string | number)[]) {
  let pattern = "";
  for (const part of path) {
    pattern += typeof part === "number" ? "[]" : `${pattern ? "." : ""}${part}`;
  }
  return pattern;
}
