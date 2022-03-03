import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

export const getV2ClientNames = (
  j: JSCodeshift,
  source: Collection<any>,
  importObj: Identifier
): Array<string> =>
  source
    .find(j.NewExpression, {
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: importObj.name },
        property: { type: "Identifier" },
      },
    })
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    );
