import { Collection, JSCodeshift } from "jscodeshift";

export interface GetRequireDeclaratorsWithIdentifier {
  identifierName: string;
  sourceValue: string;
}

export const getRequireDeclaratorsWithIdentifier = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, sourceValue }: GetRequireDeclaratorsWithIdentifier
) =>
  source.find(j.VariableDeclarator, {
    id: { type: "Identifier", name: identifierName },
    init: {
      arguments: [{ value: sourceValue }],
      callee: { type: "Identifier", name: "require" },
      type: "CallExpression",
    },
    type: "VariableDeclarator",
  });
