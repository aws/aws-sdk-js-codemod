import { Collection, JSCodeshift, ObjectPattern } from "jscodeshift";

import { getRequireVariableDeclarators } from "./getRequireVariableDeclarators";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireObjectProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const id = { type: "ObjectPattern" } as ObjectPattern;
  const requireDeclarators = getRequireVariableDeclarators(j, source, sourceValue, id).filter(
    (declarator) => {
      const { properties } = declarator.value.id as ObjectPattern;
      return properties.some(
        (property) =>
          (property.type === "Property" || property.type === "ObjectProperty") &&
          property.value.type === "Identifier" &&
          property.value.name === localName
      );
    }
  );

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
