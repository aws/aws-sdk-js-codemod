import { isDeepStrictEqual } from "util";
import { CommentKind } from "ast-types/gen/kinds";
import { Collection, JSCodeshift } from "jscodeshift";

export const addTopLevelComments = (
  j: JSCodeshift,
  source: Collection<unknown>,
  comments?: CommentKind[] | null
) => {
  if (!comments || comments.length === 0) {
    return;
  }

  const firstNode = source.find(j.Program).get("body", 0);
  const newComments = firstNode.node.comments;
  if (!isDeepStrictEqual(comments, newComments)) {
    firstNode.insertBefore(j.emptyStatement.from({ comments }));
  }
};
