import { Collection, JSCodeshift } from "jscodeshift";

import { getImportDeclarations, getImportSpecifiers } from "../importModule";
import { importSpecifierCompareFn } from "../importSpecifierCompareFn";
import { ModulesOptions } from "../types";

export const addNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ModulesOptions
) => {
  const { localName, importedName = localName, packageName } = options;

  const importSpecifiers = getImportSpecifiers(j, source, packageName);

  if (importSpecifiers.length > 0) {
    // Return if the import specifier already exists.
    if (
      importSpecifiers.find(
        (specifier) =>
          typeof specifier === "object" &&
          specifier.importedName === importedName &&
          specifier.localName === localName
      )
    ) {
      return;
    }

    // Add named import to the first import declaration.
    const firstImportDeclSpecifiers = getImportDeclarations(j, source, packageName).nodes()[0]
      .specifiers;
    if (firstImportDeclSpecifiers) {
      firstImportDeclSpecifiers.push(
        j.importSpecifier(j.identifier(importedName), j.identifier(localName))
      );
      firstImportDeclSpecifiers.sort(importSpecifierCompareFn);
      return;
    }
  }

  // Build a new import declaration.
  const v3ImportDeclaration = j.importDeclaration(
    [j.importSpecifier(j.identifier(importedName), j.identifier(localName))],
    j.stringLiteral(packageName)
  );

  const v2importDeclarations = getImportDeclarations(j, source);

  if (v2importDeclarations.size()) {
    // Insert it after the last import declaration.
    v2importDeclarations.at(0).insertAfter(v3ImportDeclaration);
    return;
  }

  // Insert it at the top of the document.
  source.get().node.program.body.unshift(v3ImportDeclaration);
};
