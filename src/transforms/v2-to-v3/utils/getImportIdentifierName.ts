import { Collection, JSCodeshift } from "jscodeshift";

export const getImportIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  literalValue: string
): string | undefined =>
  source
    .find(j.ImportDeclaration, {
      source: { value: literalValue },
    })
    .nodes()[0]?.specifiers[0]?.local.name;
