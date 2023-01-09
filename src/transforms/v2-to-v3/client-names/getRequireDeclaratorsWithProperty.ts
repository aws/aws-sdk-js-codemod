import { Collection, JSCodeshift } from "jscodeshift";

export const getRequireDeclaratorsWithProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  sourceValue: string
) =>
  source.find(j.VariableDeclarator, {
    id: { type: "Identifier" },
    init: {
      type: "MemberExpression",
      object: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
        arguments: [{ value: sourceValue }],
      },
      property: { type: "Identifier" },
    },
  });
