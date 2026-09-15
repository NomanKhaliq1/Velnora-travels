export function labelFor(terms: { slug: string; label: string }[], slug: string) {
  return (
    terms.find((term) => term.slug === slug)?.label ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

const KEYPAD: Record<string, string> = {
  A: "2", B: "2", C: "2", D: "3", E: "3", F: "3", G: "4", H: "4", I: "4",
  J: "5", K: "5", L: "5", M: "6", N: "6", O: "6", P: "7", Q: "7", R: "7", S: "7",
  T: "8", U: "8", V: "8", W: "9", X: "9", Y: "9", Z: "9",
};

/** Turns vanity numbers like 1-800-FLOWERS into dialable digits. */
export function phoneDigits(phone: string) {
  const digits = phone
    .toUpperCase()
    .replace(/[A-Z]/g, (c) => KEYPAD[c])
    .replace(/\D/g, "");
  return digits.length === 10 ? `1${digits}` : digits;
}

export const telHref = (phone: string) => `tel:+${phoneDigits(phone)}`;
export const whatsappHref = (phone: string) => `https://wa.me/${phoneDigits(phone)}`;
