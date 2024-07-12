import type { Collection, JSCodeshift } from "jscodeshift";

export interface ReplaceDeepImportOptions {
  fromPath: string;
  toPath: string;
}

export const replaceDeepImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { fromPath, toPath }: ReplaceDeepImportOptions
) => {
  source.find(j.Literal, { value: fromPath }).replaceWith(j.literal(toPath));
  source.find(j.StringLiteral, { value: fromPath }).replaceWith(j.stringLiteral(toPath));
};
