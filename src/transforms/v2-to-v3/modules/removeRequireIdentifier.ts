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

  requireDeclarators.forEach((varDeclarator) => {
    const varDeclarationCollection = j(varDeclarator).closest(j.VariableDeclaration);

    // Remove VariableDeclarator as it contains the only identifier.
    j(varDeclarator).remove();

    // Remove VariableDeclaration if there are no declarations.
    const varDeclaration = varDeclarationCollection.nodes()[0];
    if (varDeclaration && varDeclaration.declarations?.length === 0) {
      varDeclarationCollection.remove();
    }
  });
};
