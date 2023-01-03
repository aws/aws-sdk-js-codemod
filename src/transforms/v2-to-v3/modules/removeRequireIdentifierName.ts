import { Collection, Identifier, JSCodeshift, Property } from "jscodeshift";

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
      if (!declarator.init || declarator.init.type !== "Identifier") {
        return true;
      }
      if (declarator.init.name !== sourceValue) {
        return true;
      }
      if (declarator.id.type === "Identifier" && declarator.id.name === localName) {
        return false;
      }
      if (declarator.id.type === "ObjectPattern" && declarator.id.properties) {
        declarator.id.properties = declarator.id.properties.filter((property) => {
          if (!["ObjectProperty", "Property"].includes(property.type)) {
            return true;
          }
          const propertyValue = (property as Property).value as Identifier;
          return propertyValue.type !== "Identifier" || propertyValue.name !== localName;
        });
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
