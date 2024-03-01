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
        const identifierUsages = source.find(j.Identifier, { name: localName });
        // Only usage is import.
        return identifierUsages.length !== 1;
      }
    );

    // Remove ImportDeclaration if there are no import specifiers.
    if (importDeclaration.value.specifiers.length === 0) {
      removeDeclaration(j, source, importDeclaration);
    }
  });
