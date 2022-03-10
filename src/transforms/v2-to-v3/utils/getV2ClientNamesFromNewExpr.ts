import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

export const getV2ClientNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2DefaultModuleName: string
): string[] =>
  source
    .find(j.NewExpression, {
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: v2DefaultModuleName },
        property: { type: "Identifier" },
      },
    })
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    );
