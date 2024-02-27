import { Collection, JSCodeshift } from "jscodeshift";

import { addTopLevelComments } from "./addTopLevelComments";
import { getRequireObjectPatternProperty } from "./getRequireObjectPatternProperty";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireObjectPattern = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const requireObjectPatternProperty = getRequireObjectPatternProperty(j, source, {
    identifierName: localName,
    sourceValue,
  });

  const comments = source.find(j.Program).get("body", 0).node.comments;
  requireObjectPatternProperty.remove();
  addTopLevelComments(j, source, comments);
};
