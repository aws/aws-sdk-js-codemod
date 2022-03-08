import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportIdentifierNameOptions {
  identifierName: string;
  literalValue: string;
}

export const removeImportIdentifierName = (
  j: JSCodeshift,
  source: Collection<any>,
  { identifierName, literalValue }: RemoveImportIdentifierNameOptions
) => {
  source
    .find(j.ImportDeclaration, {
      specifiers: [{ local: { name: identifierName } }],
      source: { value: literalValue },
    })
    .forEach((declerationPath) => {
      // Remove default import from ImportDeclaration.
      declerationPath.value.specifiers = declerationPath.value.specifiers.filter(
        (specifier) => specifier.local.name !== identifierName
      );
      // Remove ImportDeclaration if there are no other imports.
      if (declerationPath.value.specifiers.length === 0) {
        j(declerationPath).remove();
      }
    });
};
