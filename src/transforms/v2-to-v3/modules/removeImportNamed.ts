import { Collection, JSCodeshift } from "jscodeshift";
import { removeDeclaration } from "./removeDeclaration";

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
      source: { value: sourceValue },
    })
    .filter(
      (importDeclaration) =>
        importDeclaration.value.specifiers !== undefined &&
        importDeclaration.value.specifiers.some(
          (specifier) => specifier.type === "ImportSpecifier" && specifier.local?.name === localName
        )
    )
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
        removeDeclaration(j, source, declarationPath);
      }
    });
};
