import { Collection, Identifier, JSCodeshift, MemberExpression, NewExpression } from "jscodeshift";

const getClientNewExpression = (v2DefaultModuleName: string) =>
  ({
    callee: {
      type: "MemberExpression",
      object: { type: "Identifier", name: v2DefaultModuleName },
      property: { type: "Identifier" },
    },
  } as NewExpression);

const getDocumentClientNewExpression = (v2DefaultModuleName: string) =>
  ({
    callee: {
      type: "MemberExpression",
      object: {
        type: "MemberExpression",
        object: { type: "Identifier", name: v2DefaultModuleName },
        property: { type: "Identifier", name: "DynamoDB" },
      },
      property: { type: "Identifier" },
    },
  } as NewExpression);

const getClientNameFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  newExpression: NewExpression
): string[] =>
  source
    .find(j.NewExpression, newExpression)
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    );

export const getV2ClientNamesFromNewExpr = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2DefaultModuleName: string
): string[] => [
  ...getClientNameFromNewExpr(j, source, getClientNewExpression(v2DefaultModuleName)),
  ...getClientNameFromNewExpr(j, source, getDocumentClientNewExpression(v2DefaultModuleName)),
];
