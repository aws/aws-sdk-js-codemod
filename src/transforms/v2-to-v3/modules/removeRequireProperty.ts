import { Collection, JSCodeshift } from "jscodeshift";

import { getRequireDeclaratorsWithProperty } from "../client-names";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  propertyName: string;
  sourceValue: string;
}

export const removeRequireProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, propertyName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const requireDeclarators = getRequireDeclaratorsWithProperty(j, source, {
    identifierName: propertyName,
    localName,
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
