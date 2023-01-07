import { Collection, JSCodeshift, ObjectPattern } from "jscodeshift";

import { getRequireDeclaratorsWithObjectPattern } from "./getRequireDeclaratorsWithObjectPattern";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireObjectProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const requireDeclarators = getRequireDeclaratorsWithObjectPattern(j, source, {
    identifierName: localName,
    sourceValue,
  });

  requireDeclarators.forEach((varDeclarator) => {
    const varDeclarationCollection = j(varDeclarator).closest(j.VariableDeclaration);

    // Remove ObjectProperty from Variable Declarator.
    const varDeclaratorId = varDeclarator.value.id as ObjectPattern;
    varDeclaratorId.properties = varDeclaratorId.properties.filter(
      (property) =>
        (property.type !== "Property" && property.type !== "ObjectProperty") ||
        property.value.type !== "Identifier" ||
        property.value.name !== localName
    );

    // Remove VariableDeclarator if there are no properties.
    if (varDeclaratorId.properties.length === 0) {
      j(varDeclarator).remove();

      // Remove VariableDeclaration if there are no declarations.
      const varDeclaration = varDeclarationCollection.nodes()[0];
      if (varDeclaration && varDeclaration.declarations?.length === 0) {
        varDeclarationCollection.remove();
      }
    }
  });
};
