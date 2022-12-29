import { Collection, Identifier, JSCodeshift } from "jscodeshift";

export const getRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  sourceValue: string
): string | undefined =>
  (
    source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "require" },
          arguments: [{ value: sourceValue }],
        },
      })
      .nodes()[0]?.id as Identifier
  )?.name;
