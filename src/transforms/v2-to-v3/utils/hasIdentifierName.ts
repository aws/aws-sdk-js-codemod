import { VariableDeclaration, VariableDeclarator } from "jscodeshift";

export const hasIdentifierName = (varDeclaration: VariableDeclaration, identifierName: string) =>
  (varDeclaration.declarations as VariableDeclarator[]).some(
    (varDeclarator) =>
      varDeclarator.id.type === "Identifier" && varDeclarator.id.name === identifierName
  );
