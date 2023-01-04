import { Collection, JSCodeshift, ObjectPattern } from "jscodeshift";

import { getRequireDeclarators } from "./getRequireDeclarators";

export interface RemoveRequireObjectPropertyOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireObjectProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireObjectPropertyOptions
) => {
  const id = {
    type: "ObjectPattern",
    properties: [{ type: "Property", value: { type: "Identifier", name: localName } }],
  } as ObjectPattern;
  const requireDeclarators = getRequireDeclarators(j, source, sourceValue, id);

  requireDeclarators.forEach((varDeclarator) => {
    const varDeclarationCollection = j(varDeclarator).closest(j.VariableDeclaration);

    // Remove Identifier or ObjectPattern from VariableDeclarator.
    const varDeclaratorId = varDeclarator.value.id as ObjectPattern;
    varDeclaratorId.properties = varDeclaratorId.properties.filter(
      (property) =>
        property.type !== "Property" ||
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
