import { Collection, JSCodeshift, ObjectPattern, VariableDeclarator } from "jscodeshift";

import { getRequireVariableDeclaration } from "../get";

export interface RemoveRequireIdentifierNameOptions {
  localName: string;
  sourceValue: string;
}

const hasIdentifierName = (varDeclarator: VariableDeclarator, localName: string) =>
  varDeclarator.id.type === "Identifier" && varDeclarator.id.name === localName;

const hasObjectPropertyName = (varDeclarator: VariableDeclarator, localName: string) =>
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
      if (declarations.some((varDeclarator) => hasIdentifierName(varDeclarator, localName))) {
        return true;
      }
      if (declarations.some((varDeclarator) => hasObjectPropertyName(varDeclarator, localName))) {
        return true;
      }
      return false;
    })
    .remove();
};
