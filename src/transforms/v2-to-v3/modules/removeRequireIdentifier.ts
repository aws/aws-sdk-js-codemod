import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getRequireDeclarators } from "./getRequireDeclarators";

export interface RemoveRequireIdentifierOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireIdentifier = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireIdentifierOptions
) => {
  const id = { type: "Identifier", name: localName } as Identifier;
  const requireDeclarators = getRequireDeclarators(j, source, sourceValue, id);

  requireDeclarators.forEach((varDeclarator) => {
    const varDeclarationCollection = j(varDeclarator).closest(j.VariableDeclaration);

    // Remove Identifier or ObjectPattern from VariableDeclarator.
    j(varDeclarator).remove();

    // Remove VariableDeclaration if there are no declarations.
    const varDeclaration = varDeclarationCollection.nodes()[0];
    if (varDeclaration && varDeclaration.declarations?.length === 0) {
      varDeclarationCollection.remove();
    }
  });
};
