import { ASTPath, VariableDeclaration, VariableDeclarator } from "jscodeshift";

export const hasObjectPropertyName = (
  varDeclaration: ASTPath<VariableDeclaration>,
  objectPropertyName: string
) =>
  (varDeclaration.value.declarations as VariableDeclarator[]).some(
    (varDeclarator) =>
      varDeclarator.id.type === "ObjectPattern" &&
      varDeclarator.id.properties.some(
        (property) =>
          property.type === "Property" &&
          property.value.type === "Identifier" &&
          property.value.name === objectPropertyName
      )
  );
