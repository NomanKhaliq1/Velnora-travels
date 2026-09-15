/**
 * Page copy has no hand-written schema, so edits are checked against the
 * structure of the current file instead: same fields, same value types,
 * list items shaped like the existing ones.
 */
export function shapeErrors(template: unknown, value: unknown, at = "page"): string[] {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return [`${at} should be a list`];
    if (template.length === 0) return [];
    return value.flatMap((item, i) => shapeErrors(template[0], item, `${at}[${i + 1}]`));
  }

  if (template !== null && typeof template === "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return [`${at} should be a group of fields`];
    }
    const expected = template as Record<string, unknown>;
    const actual = value as Record<string, unknown>;
    const errors: string[] = [];
    for (const key of Object.keys(expected)) {
      if (!(key in actual)) errors.push(`${at}.${key} is missing`);
      else errors.push(...shapeErrors(expected[key], actual[key], `${at}.${key}`));
    }
    for (const key of Object.keys(actual)) {
      if (!(key in expected)) errors.push(`${at}.${key} is not a known field`);
    }
    return errors;
  }

  if (typeof template !== typeof value) return [`${at} should be a ${typeof template}`];
  return [];
}
