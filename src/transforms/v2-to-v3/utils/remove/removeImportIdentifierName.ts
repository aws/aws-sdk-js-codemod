import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportIdentifierNameOptions {
  localName: string;
  literalValue: string;
}

export const removeImportIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, literalValue }: RemoveImportIdentifierNameOptions
) => {
  source
    .find(j.ImportDeclaration, {
      specifiers: [{ local: { name: localName } }],
      source: { value: literalValue },
    })
    .forEach((declarationPath) => {
      // Remove default import from ImportDeclaration.
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter(
        (specifier) => specifier.local?.name !== localName
      );
      // Remove ImportDeclaration if there are no other imports.
      if (declarationPath.value.specifiers?.length === 0) {
        j(declarationPath).remove();
      }
    });
};
