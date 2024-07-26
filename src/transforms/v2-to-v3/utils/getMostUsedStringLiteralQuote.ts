import type { Collection, JSCodeshift } from "jscodeshift";

export enum StringLiteralQuoteType {
  SINGLE = "single",
  DOUBLE = "double",
}

export const getMostUsedStringLiteralQuote = (
  j: JSCodeshift,
  source: Collection<unknown>
): StringLiteralQuoteType => {
  const quoteCount: Record<StringLiteralQuoteType, number> = {
    [StringLiteralQuoteType.SINGLE]: 0,
    [StringLiteralQuoteType.DOUBLE]: 0,
  };

  source.find(j.Literal).forEach((path) => {
    const value = path.node.value;

    // Check if the literal value is a string and contains single quotes
    if (typeof value === "string") {
      // @ts-expect-error Property 'raw' does not exist on type 'Literal'.
      const rawValue = path.node.raw || path.node.extra?.raw || "";
      if (rawValue.startsWith("'")) {
        quoteCount[StringLiteralQuoteType.SINGLE]++;
      } else if (rawValue.startsWith('"')) {
        quoteCount[StringLiteralQuoteType.DOUBLE]++;
      }
    }
  });

  if (quoteCount[StringLiteralQuoteType.SINGLE] > quoteCount[StringLiteralQuoteType.DOUBLE]) {
    return StringLiteralQuoteType.SINGLE;
  }
  return StringLiteralQuoteType.DOUBLE;
};
