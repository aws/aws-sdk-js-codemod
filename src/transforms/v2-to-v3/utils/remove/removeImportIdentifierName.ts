import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportIdentifierNameOptions {
  importedName?: string;
  localName: string;
  sourceValue: string;
}

export const removeImportIdentifierName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: RemoveImportIdentifierNameOptions
) => {
  const { importedName, localName, sourceValue } = options;

  source
    .find(j.ImportDeclaration, {
      specifiers: [{ local: { name: localName } }],
      source: { value: sourceValue },
    })
    .forEach((declarationPath) => {
      // Remove import from ImportDeclaration.
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter((specifier) => {
        if (specifier.local?.name === localName) {
          if (specifier.type === "ImportSpecifier" && importedName) {
            return specifier.imported?.name === importedName;
          }
          return false;
        }
      });
      // Remove ImportDeclaration if there are no other imports.
      if (declarationPath.value.specifiers?.length === 0) {
        j(declarationPath).remove();
      }
    });
};
