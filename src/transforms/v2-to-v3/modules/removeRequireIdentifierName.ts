import { Collection, JSCodeshift } from "jscodeshift";

import { hasPropertyWithName } from "../utils";
import { getRequireVariableDeclaration } from "./getRequireVariableDeclaration";

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
