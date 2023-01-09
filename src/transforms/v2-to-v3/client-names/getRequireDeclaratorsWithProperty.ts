import { Collection, JSCodeshift } from "jscodeshift";

export interface GetRequireDeclaratorsWithPropertyOptions {
  localName?: string;
  identifierName?: string;
  sourceValue: string;
}

export const getRequireDeclaratorsWithProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, identifierName, sourceValue }: GetRequireDeclaratorsWithPropertyOptions
) =>
  source.find(j.VariableDeclarator, {
    id: { type: "Identifier", ...(localName && { name: localName }) },
    init: {
      type: "MemberExpression",
      object: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
        arguments: [{ value: sourceValue }],
      },
      property: { type: "Identifier", ...(identifierName && { name: identifierName }) },
    },
  });
