import { Collection, JSCodeshift } from "jscodeshift";

export const getRequireIds = (j: JSCodeshift, source: Collection<unknown>, sourceValue: string) =>
  source
    .find(j.VariableDeclarator, {
      init: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "require" },
        arguments: [{ value: sourceValue }],
      },
    })
    .nodes()
    .map((variableDeclarator) => variableDeclarator.id);
