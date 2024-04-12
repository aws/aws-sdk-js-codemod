import { Collection, JSCodeshift } from "jscodeshift";

export const addPromiseRemovalComments = (j: JSCodeshift, source: Collection<unknown>): void => {
  // Add comment for .promise() calls which weren't removed.
  source
    .find(j.CallExpression, {
      callee: {
        type: "MemberExpression",
        property: { type: "Identifier", name: "promise" },
      },
    })
    .forEach((callExpression) => {
      callExpression.value.comments = [
        ...(callExpression.value.comments || []),
        j.commentLine(" This is a comment before the CallExpression"),
      ];
    });
};
