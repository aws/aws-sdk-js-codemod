import { Collection, JSCodeshift } from "jscodeshift";
import { removeDeclaration } from "../removeDeclaration";
import { getImportDeclarations } from "./getImportDeclarations";

export const removeImport = (j: JSCodeshift, source: Collection<unknown>) =>
  getImportDeclarations(j, source).forEach((importDeclaration) => {
    importDeclaration.value.specifiers = (importDeclaration.value.specifiers || []).filter(
      (specifier) => {
        const localName = specifier.local?.name;
        if (!localName) {
          return true;
        }
        const identifiers = source.find(j.Identifier, { name: localName });
        const importedName = specifier.type === "ImportSpecifier" && specifier.imported?.name;

        if (importedName && importedName === localName) {
          // Two occurrences: one imported identifier and one local identifier.
          if (identifiers.size() === 2) {
            return false;
          }
          // ToDo: check if similar specifier exists from @aws-sdk import declaration
          return true;
        }
        // One occurrence: local identifier.
        if (identifiers.size() === 1) {
          return false;
        }
        // ToDo: check if similar specifier exists from @aws-sdk import declaration
        return true;
      }
    );

    // Remove ImportDeclaration if there are no import specifiers.
    if (importDeclaration.value.specifiers.length === 0) {
      removeDeclaration(j, source, importDeclaration);
    }
  });
