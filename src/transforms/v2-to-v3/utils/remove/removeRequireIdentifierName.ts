import { Collection, Identifier, JSCodeshift, VariableDeclarator } from "jscodeshift";

import { getRequireVariableDeclaration } from "../get";

export interface RemoveRequireIdentifierNameOptions {
  identifierName: string;
  literalValue: string;
}

export const removeRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, literalValue }: RemoveRequireIdentifierNameOptions
) => {
  getRequireVariableDeclaration(j, source, literalValue)
    .filter(
      (nodePath) =>
        ((nodePath.value.declarations[0] as VariableDeclarator).id as Identifier).name ===
        identifierName
    )
    .remove();
};
