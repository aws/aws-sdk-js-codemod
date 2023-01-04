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
      // Remove named import from ImportDeclaration if there is a match.
      declarationPath.value.specifiers = declarationPath.value.specifiers?.filter((specifier) => {
        if (specifier.type !== "ImportSpecifier") {
          return true;
        }
        return (
          specifier.local?.name !== localName ||
          (importedName && specifier.imported?.name !== importedName)
        );
      });

      // Remove ImportDeclaration if there are no import specifiers.
      if (declarationPath.value.specifiers?.length === 0) {
        j(declarationPath).remove();
      }
    });
};
