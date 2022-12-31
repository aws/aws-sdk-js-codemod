import { ASTPath, ObjectPattern, VariableDeclaration, VariableDeclarator } from "jscodeshift";

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

export interface HasPropertyWithNameOptions {
  identifierName?: string;
  objectPropertyName?: string;
}

export const hasPropertyWithName = (
  varDeclaration: ASTPath<VariableDeclaration>,
  { identifierName, objectPropertyName }: HasPropertyWithNameOptions
) => {
  const declarations = varDeclaration.value.declarations.filter(
    (declaration) => declaration.type === "VariableDeclarator"
  ) as VariableDeclarator[];

  if (
    identifierName &&
    declarations.some((varDeclarator) => hasIdentifierName(varDeclarator, identifierName))
  ) {
    return true;
  }

  if (
    objectPropertyName &&
    declarations.some((varDeclarator) => hasObjectPropertyName(varDeclarator, objectPropertyName))
  ) {
    return true;
  }

  return false;
};
