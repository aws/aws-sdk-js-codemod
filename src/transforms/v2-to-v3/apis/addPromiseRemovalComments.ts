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
    .forEach(({ node }) => {
      const comments = node.comments || [];
      comments.push(j.commentLine(" The `.promise()` call might be on an JS SDK v2 client API."));
      comments.push(
        j.commentLine(" If yes, please remove .promise(). If not, remove this comment.")
      );
      node.comments = comments;
    });
};
