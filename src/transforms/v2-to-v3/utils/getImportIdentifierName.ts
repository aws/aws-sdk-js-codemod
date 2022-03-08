import { Collection, JSCodeshift } from "jscodeshift";

export const getImportIdentifierName = (
  j: JSCodeshift,
  source: Collection<any>,
  literalValue: string
): string | undefined =>
  source
    .find(j.ImportDeclaration, {
      source: { type: "Literal", value: literalValue },
    })
    .nodes()[0]?.specifiers[0]?.local.name;
