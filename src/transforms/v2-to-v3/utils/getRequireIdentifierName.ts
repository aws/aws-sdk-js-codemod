import { Collection, Identifier, JSCodeshift } from "jscodeshift";

export const getRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<any>,
  literalValue: string
): string | undefined =>
  (
    source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "require" },
          arguments: [{ value: literalValue }],
        },
      })
      .nodes()[0]?.id as Identifier
  )?.name;
