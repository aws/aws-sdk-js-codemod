import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportIdentifierNameOptions {
  identifierName: string;
  literalValue: string;
}

export const removeImportIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, literalValue }: RemoveImportIdentifierNameOptions
) => {
  source
    .find(j.ImportDeclaration, {
      specifiers: [{ local: { name: identifierName } }],
      source: { value: literalValue },
    })
    .forEach((declarationPath) => {
      // Remove default import from ImportDeclaration.
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter(
        (specifier) => specifier.local?.name !== identifierName
      );
      // Remove ImportDeclaration if there are no other imports.
      if (declarationPath.value.specifiers?.length === 0) {
        j(declarationPath).remove();
      }
    });
};
