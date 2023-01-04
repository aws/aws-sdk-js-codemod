import { Collection, Identifier, JSCodeshift, ObjectPattern } from "jscodeshift";

export const getRequireDeclarators = (
  j: JSCodeshift,
  source: Collection<unknown>,
  sourceValue: string,
  id?: Identifier | ObjectPattern
) =>
  source.find(j.VariableDeclarator, {
    ...(id && { id }),
    init: {
      arguments: [{ value: sourceValue }],
      callee: { type: "Identifier", name: "require" },
      type: "CallExpression",
    },
    type: "VariableDeclarator",
  });
