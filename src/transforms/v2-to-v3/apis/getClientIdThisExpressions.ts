import type { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";
import type { ThisMemberExpression } from "../types";

const thisMemberExpression = { type: "MemberExpression", object: { type: "ThisExpression" } };

export const getClientIdThisExpressions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: Identifier[]
): ThisMemberExpression[] =>
  clientIdentifiers.flatMap((clientIdentifier) => {
    const clientIdsFromThisExpressionAssignment = source
      .find(j.AssignmentExpression, {
        left: thisMemberExpression as MemberExpression,
        right: clientIdentifier,
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
          }) as ThisMemberExpression
      );

    const clientIdsFromThisExpression = source
      .find(j.MemberExpression, {
        type: "MemberExpression",
        object: { type: "ThisExpression" },
        property: clientIdentifier,
      })
      .nodes()
      .map(
        (memberExpression) =>
          ({
            ...thisMemberExpression,
            property: {
              type: "Identifier",
              name: (memberExpression.property as Identifier).name,
            },
          }) as ThisMemberExpression
      )[0];

    return [...clientIdsFromThisExpressionAssignment, clientIdsFromThisExpression];
  });
