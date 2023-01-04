import { Collection, JSCodeshift } from "jscodeshift";

import { getRequireVariableDeclarators } from "./getRequireVariableDeclarators";

export interface RemoveRequireIdentifierNameOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireIdentifierNameOptions
) => {
  const requireDeclarators = getRequireVariableDeclarators(j, source, sourceValue);

  requireDeclarators.forEach((varDeclarator) => {
    const varDeclarationCollection = j(varDeclarator).closest(j.VariableDeclaration);
    const varDeclaration = varDeclarationCollection.nodes()[0];

    // ToDo: Add id calling getRequireVariableDeclarators which uses localName to filter.
    j(varDeclarator).remove();

    // Remove VariableDeclaration if there are no declarations.
    if (varDeclaration.declarations?.length === 0) {
      varDeclarationCollection.remove();
    }
  });
};
