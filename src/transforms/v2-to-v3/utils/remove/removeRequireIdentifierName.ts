import { Collection, Identifier, JSCodeshift, VariableDeclarator } from "jscodeshift";

import { getRequireVariableDeclaration } from "../get";

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
    .filter(
      (nodePath) =>
        ((nodePath.value.declarations[0] as VariableDeclarator).id as Identifier).name === localName
    )
    .remove();
};
