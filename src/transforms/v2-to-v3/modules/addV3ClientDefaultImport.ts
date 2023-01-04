import { Collection, ImportDefaultSpecifier, JSCodeshift } from "jscodeshift";

import { getV3ClientDefaultLocalName } from "../utils";
import { getV2ImportDeclaration } from "./getV2ImportDeclaration";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientDefaultImport = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientLocalName, v2ClientName, v3ClientPackageName }: V3ClientModulesOptions
) => {
  const localName = getV3ClientDefaultLocalName(v2ClientLocalName);
  const defaultImportSpecifier = j.importDefaultSpecifier(j.identifier(localName));
  const existingImports = source.find(j.ImportDeclaration, {
    source: { value: v3ClientPackageName },
  });

  const existingImportDefaultSpecifiers = existingImports
    .nodes()
    .map((importDeclaration) => importDeclaration.specifiers)
    .flat()
    .filter(
      (importSpecifier) => importSpecifier?.type === "ImportDefaultSpecifier"
    ) as ImportDefaultSpecifier[];

  if (existingImports.length) {
    if (
      !existingImportDefaultSpecifiers.find((specifier) => specifier?.local?.name === localName)
    ) {
      existingImports.nodes()[0].specifiers?.push(defaultImportSpecifier);
      return;
    }
  }

  // Insert after global import, or service import.
  const v2ImportDeclaration = getV2ImportDeclaration(j, source, {
    v2ClientName,
    v2ClientLocalName,
  });

  const importDeclaration = j.importDeclaration(
    [defaultImportSpecifier],
    j.stringLiteral(v3ClientPackageName)
  );

  if (v2ImportDeclaration && v2ImportDeclaration.nodes().length > 0) {
    v2ImportDeclaration.at(0).insertAfter(importDeclaration);
  } else {
    // Unreachable code, throw error
    throw new Error(
      "Base Import Declaration not found to insert new Import Declaration.\n" +
        "Please report your use case on https://github.com/awslabs/aws-sdk-js-codemod"
    );
  }
};
