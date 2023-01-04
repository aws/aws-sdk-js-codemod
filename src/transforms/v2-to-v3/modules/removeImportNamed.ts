import { Collection, JSCodeshift } from "jscodeshift";

export interface RemoveImportNamedOptions {
  importedName?: string;
  localName: string;
  sourceValue: string;
}

export const removeImportNamed = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { importedName, localName, sourceValue }: RemoveImportNamedOptions
) => {
  source
    .find(j.ImportDeclaration, {
      specifiers: [{ local: { name: localName } }],
      source: { value: sourceValue },
    })
    .forEach((declarationPath) => {
      // Remove import from ImportDeclaration.
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter((specifier) => {
        if (specifier.type !== "ImportSpecifier") {
          return true;
        }
        if (specifier.local?.name === localName) {
          if (importedName) {
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
