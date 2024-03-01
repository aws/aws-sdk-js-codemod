import { Collection, JSCodeshift } from "jscodeshift";
import { removeDeclaration } from "../removeDeclaration";
import { getImportDeclarations } from "./getImportDeclarations";

const isAnotherSpecifier = (j: JSCodeshift, source: Collection<unknown>, localName: string) =>
  source
    .find(j.ImportDeclaration, { specifiers: [{ local: { name: localName } }] })
    .filter((importDeclaration) => {
      const sourceValue = importDeclaration.value.source.value;
      if (typeof sourceValue !== "string") {
        return false;
      }
      return sourceValue.startsWith("@aws-sdk/");
    })
    .size() > 0;

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
          return !isAnotherSpecifier(j, source, localName);
        }
        // One occurrence: local identifier.
        if (identifiers.size() === 1) {
          return false;
        }
        return !isAnotherSpecifier(j, source, localName);
      }
    );

    // Remove ImportDeclaration if there are no import specifiers.
    if (importDeclaration.value.specifiers.length === 0) {
      removeDeclaration(j, source, importDeclaration);
    }
  });
