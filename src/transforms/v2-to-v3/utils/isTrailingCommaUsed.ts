import type { Collection, JSCodeshift } from "jscodeshift";

export const isTrailingCommaUsed = (j: JSCodeshift, source: Collection<unknown>) => {
  for (const node of source.find(j.ObjectExpression).nodes()) {
    // @ts-ignore Property 'extra' does not exist on type 'ObjectExpression'.
    if (node.extra && node.extra.trailingComma) {
      return true;
    }
  }
  return false;
};
