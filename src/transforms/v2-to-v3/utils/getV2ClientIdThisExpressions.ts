import { Collection, Identifier, JSCodeshift, ThisExpression } from "jscodeshift";

export interface ThisMemberExpression {
  type: "MemberExpression";
  object: ThisExpression;
  property: Identifier;
}

export const getV2ClientIdThisExpressions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientIdNames: Identifier[]
): ThisMemberExpression[] => {
  // ToDo: return MemberExpression based on v2ClientIdNames
  return [
    {
      type: "MemberExpression",
      object: {
        type: "ThisExpression",
      },
      property: {
        type: "Identifier",
        name: "client",
      },
    },
  ];
};
