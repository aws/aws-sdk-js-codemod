import { Collection, JSCodeshift } from "jscodeshift";

export const getRequireVariableDeclaration = (
  j: JSCodeshift,
  source: Collection<unknown>,
  sourceValue: string
) =>
  source.find(j.VariableDeclaration, {
    declarations: [
      {
        init: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "require" },
          arguments: [{ value: sourceValue }],
        },
      },
    ],
  });
