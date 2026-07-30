export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const COMBINING_DIACRITICS_START = 0x0300;
const COMBINING_DIACRITICS_END = 0x036f;

export function normalizeText(value: string): string {
  const chars = Array.from(value.normalize("NFD")).filter((char) => {
    const code = char.codePointAt(0) ?? 0;
    return code < COMBINING_DIACRITICS_START || code > COMBINING_DIACRITICS_END;
  });
  return chars
    .join("")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

export function generateId(prefix = "id"): string {
  const random = crypto.getRandomValues(new Uint32Array(4)).join("-");
  return `${prefix}-${random}`;
}
