import { Collection, JSCodeshift } from "jscodeshift";

import { addTopLevelComments } from "./addTopLevelComments";
import { getRequireDeclaratorsWithObjectPattern } from "./getRequireDeclaratorsWithObjectPattern";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireObjectPattern = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const requireDeclarators = getRequireDeclaratorsWithObjectPattern(j, source, {
    identifierName: localName,
    sourceValue,
  });

  const comments = source.find(j.Program).get("body", 0).node.comments;
  requireDeclarators.remove();
  addTopLevelComments(j, source, comments);
};
