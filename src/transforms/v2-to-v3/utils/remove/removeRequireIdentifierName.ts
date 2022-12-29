import { Collection, JSCodeshift, ObjectPattern, VariableDeclarator } from "jscodeshift";

import { getRequireVariableDeclaration } from "../get";

export interface RemoveRequireIdentifierNameOptions {
  localName: string;
  sourceValue: string;
}

const containsIdentifier = (varDeclarator: VariableDeclarator) =>
  varDeclarator.id.type === "Identifier";

const containsObjectWithName = (varDeclarator: VariableDeclarator, localName: string) =>
  varDeclarator.id.type === "ObjectPattern" &&
  (varDeclarator.id as ObjectPattern).properties.some(
    (property) =>
      property.type === "Property" &&
      property.value.type === "Identifier" &&
      property.value.name === localName
  );

export const removeRequireIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireIdentifierNameOptions
) => {
  getRequireVariableDeclaration(j, source, sourceValue)
    .filter((variableDeclaration) => {
      const declarations = variableDeclaration.value.declarations as VariableDeclarator[];
      if (declarations.some(containsIdentifier)) {
        return true;
      }
      if (declarations.some((varDeclarator) => containsObjectWithName(varDeclarator, localName))) {
        return true;
      }
      return false;
    })
    .remove();
};
