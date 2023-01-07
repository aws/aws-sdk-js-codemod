import { Collection, JSCodeshift } from "jscodeshift";

export const getRequireDeclarators = (
  j: JSCodeshift,
  source: Collection<unknown>,
  sourceValue: string
) =>
  source.find(j.VariableDeclarator, {
    init: {
      arguments: [{ value: sourceValue }],
      callee: { type: "Identifier", name: "require" },
      type: "CallExpression",
    },
    type: "VariableDeclarator",
  });
