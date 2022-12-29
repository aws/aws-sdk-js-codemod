import { Collection, JSCodeshift } from "jscodeshift";

import { getRequireVariableDeclaration } from "../get";
import { hasPropertyWithName } from "../has";

export interface RemoveRequireIdentifierNameOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireIdentifierNameOptions
) => {
  getRequireVariableDeclaration(j, source, sourceValue)
    .filter((varDeclaration) =>
      hasPropertyWithName(varDeclaration, {
        identifierName: localName,
        objectPropertyName: localName,
      })
    )
    .remove();
};
