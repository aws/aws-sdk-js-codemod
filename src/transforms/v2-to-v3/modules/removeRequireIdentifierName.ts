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

    // Remove Identifier or ObjectPattern from VariableDeclarator.
    varDeclaration.declarations = varDeclaration.declarations?.filter((declarator) => {
      if (declarator.type !== "VariableDeclarator") {
        return true;
      }
      if (declarator.id.type === "Identifier" && declarator.id.name === localName) {
        return false;
      }
      if (declarator.id.type === "ObjectPattern" && declarator.id.properties) {
        declarator.id.properties = declarator.id.properties.filter(
          (property) =>
            property.type !== "Property" ||
            property.value.type !== "Identifier" ||
            property.value.name !== localName
        );
        return declarator.id.properties.length > 0;
      }
      return true;
    });

    // Remove VariableDeclaration if there are no declarations.
    if (varDeclaration.declarations?.length === 0) {
      varDeclarationCollection.remove();
    }
  });
};
