import { Collection, JSCodeshift } from "jscodeshift";

export const getRequireVariableDeclaration = (
  j: JSCodeshift,
  source: Collection<any>,
  literalValue: string
) =>
  source.find(j.VariableDeclaration, {
    declarations: [
      {
        init: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "require" },
          arguments: [{ type: "Literal", value: literalValue }],
        },
      },
    ],
  });
