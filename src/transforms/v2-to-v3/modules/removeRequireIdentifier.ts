import { Collection, JSCodeshift } from "jscodeshift";

import { addTopLevelComments } from "./addTopLevelComments";
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

  const comments = source.find(j.Program).get("body", 0).node.comments;
  requireDeclarators.remove();
  addTopLevelComments(j, source, comments);
};
