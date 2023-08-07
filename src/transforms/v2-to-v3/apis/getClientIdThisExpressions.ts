import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";
import { ThisMemberExpression } from "../types";

const thisMemberExpression = { type: "MemberExpression", object: { type: "ThisExpression" } };

export const getClientIdThisExpressions = (
  j: JSCodeshift,
  source: Collection<unknown>,
  clientIdentifiers: Identifier[]
): ThisMemberExpression[] =>
  clientIdentifiers.flatMap((clientIdentifier) =>
    source
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
      )
  );
