import { Collection, JSCodeshift, ObjectPattern } from "jscodeshift";

import { getRequireDeclarators } from "./getRequireDeclarators";
import { removeRequireDeclarators } from "./removeRequireDeclarators";

export interface RemoveRequireObjectPatternOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireObjectPattern = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireObjectPatternOptions
) => {
  const id = {
    type: "ObjectPattern",
    properties: [{ type: "Property", value: { type: "Identifier", name: localName } }],
  } as ObjectPattern;
  removeRequireDeclarators(j, getRequireDeclarators(j, source, sourceValue, id));
};
