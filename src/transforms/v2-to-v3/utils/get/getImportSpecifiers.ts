import { Collection, JSCodeshift } from "jscodeshift";

export const getImportSpecifiers = (
  j: JSCodeshift,
  source: Collection<unknown>,
  literalValue: string
) =>
  source
    .find(j.ImportDeclaration, {
      source: { value: literalValue },
    })
    .nodes()[0]?.specifiers;
