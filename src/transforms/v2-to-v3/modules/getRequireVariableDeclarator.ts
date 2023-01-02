import { Collection, Identifier, JSCodeshift, ObjectPattern } from "jscodeshift";

export const getRequireVariableDeclarator = (
  j: JSCodeshift,
  source: Collection<unknown>,
  id: Identifier | ObjectPattern,
  sourceValue: string
) =>
  source.find(j.VariableDeclarator, {
    id,
    init: {
      arguments: [{ value: sourceValue }],
      callee: { type: "Identifier", name: "require" },
      type: "CallExpression",
    },
    type: "VariableDeclarator",
  });
