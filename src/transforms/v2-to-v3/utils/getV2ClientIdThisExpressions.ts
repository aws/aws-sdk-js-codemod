import { Collection, Identifier, JSCodeshift, MemberExpression, ThisExpression } from "jscodeshift";

export interface ThisMemberExpression {
  type: "MemberExpression";
  object: ThisExpression;
  property: Identifier;
}

const thisMemberExpression = { type: "MemberExpression", object: { type: "ThisExpression" } };

export const getV2ClientIdThisExpressions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientIdentifiers: Identifier[]
): ThisMemberExpression[] =>
  v2ClientIdentifiers.flatMap((v2ClientIdentifier) =>
    source
      .find(j.AssignmentExpression, {
        left: thisMemberExpression as MemberExpression,
        right: v2ClientIdentifier,
      })
      .nodes()
      .map(
        (assignmentExpression) =>
          ({
            ...thisMemberExpression,
            property: {
              type: "Identifier",
              name: ((assignmentExpression.left as MemberExpression).property as Identifier).name,
            },
          } as ThisMemberExpression)
      )
  );
