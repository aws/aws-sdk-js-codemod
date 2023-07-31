import { Collection, ImportSpecifier, JSCodeshift } from "jscodeshift";

import { getImportDeclaration } from "../getImportDeclaration";
import { getImportSpecifier } from "../getImportSpecifier";
import { getImportSpecifiers } from "../getImportSpecifiers";
import { importSpecifierCompareFn } from "../importSpecifierCompareFn";
import { ClientModulesOptions, ImportSpecifierOptions } from "../types";

export const addClientNamedModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions & ImportSpecifierOptions
) => {
  const { importedName, v2ClientName, v2ClientLocalName, v3ClientPackageName } = options;
  const localName = options.localName ?? importedName;

  const importDeclarations = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  if (importDeclarations.size()) {
    const allImportSpecifiers = getImportSpecifiers(j, source, v3ClientPackageName).filter(
      (importSpecifier) => importSpecifier?.type === "ImportSpecifier"
    ) as ImportSpecifier[];

    if (
      allImportSpecifiers.find(
        (specifier) =>
          specifier?.imported?.name === importedName && specifier?.local?.name === localName
      )
    ) {
      return;
    }

    const firstImportDeclSpecifiers = importDeclarations.nodes()[0].specifiers;
    if (firstImportDeclSpecifiers) {
      firstImportDeclSpecifiers.push(getImportSpecifier(j, { importedName, localName }));
      firstImportDeclSpecifiers.sort(importSpecifierCompareFn);
      return;
    }
  }

  // Insert after global import, or service import.
  const v2ImportDeclaration = getImportDeclaration(j, source, {
    v2ClientName,
    v2ClientLocalName,
  });

  const v3ImportDeclaration = j.importDeclaration(
    [getImportSpecifier(j, { importedName, localName })],
    j.stringLiteral(v3ClientPackageName)
  );

  if (v2ImportDeclaration && v2ImportDeclaration.nodes().length > 0) {
    v2ImportDeclaration.at(0).insertAfter(v3ImportDeclaration);
  } else {
    // Unreachable code, throw error
    throw new Error(
      "Base Import Declaration not found to insert new Import Declaration.\n" +
        "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
    );
  }
};
