import { Collection, Identifier, JSCodeshift } from "jscodeshift";

export const getV2DefaultRequireName = (
  j: JSCodeshift,
  source: Collection<any>
): string | undefined =>
  (
    source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "require" },
          arguments: [{ type: "Literal", value: "aws-sdk" }],
        },
      })
      .nodes()[0]?.id as Identifier
  )?.name;
