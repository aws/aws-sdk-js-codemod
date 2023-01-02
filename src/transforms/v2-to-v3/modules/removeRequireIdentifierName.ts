import { Collection, JSCodeshift } from "jscodeshift";

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
  const requireDeclaration = getRequireVariableDeclaration(j, source, sourceValue);

  requireDeclaration.forEach((varDeclaration) => {
    // Remove Identifier or ObjectPattern from VariableDeclarator.
    varDeclaration.value.declarations = varDeclaration.value.declarations?.filter((declarator) => {
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

    // Remove ImportDeclaration if there are no other imports.
    if (varDeclaration.value.declarations?.length === 0) {
      j(varDeclaration).remove();
    }
  });
};
