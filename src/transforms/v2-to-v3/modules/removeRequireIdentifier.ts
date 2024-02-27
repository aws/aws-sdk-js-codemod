import { isDeepStrictEqual } from "util";
import { Collection, JSCodeshift } from "jscodeshift";

import { getRequireDeclaratorsWithIdentifier } from "./getRequireDeclaratorsWithIdentifier";

export interface RemoveRequireIdentifierOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireIdentifier = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireIdentifierOptions
) => {
  const requireDeclarators = getRequireDeclaratorsWithIdentifier(j, source, {
    identifierName: localName,
    sourceValue,
  });

  const commentsBeforeRemoval = source.find(j.Program).get("body", 0).node.comments;
  requireDeclarators.remove();
  if (commentsBeforeRemoval?.length) {
    const firstNode = source.find(j.Program).get("body", 0);
    const commentsAfterRemoval = firstNode.node.comments;
    if (!isDeepStrictEqual(commentsBeforeRemoval, commentsAfterRemoval)) {
      firstNode.insertBefore(j.emptyStatement.from({ comments: commentsBeforeRemoval }));
    }
  }
};
