import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getClientDeepImportPath } from "../utils";

export interface GetImportDeclarationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
}

export const getImportDeclaration = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetImportDeclarationOptions
) => {
  // Support DynamoDB.DocumentClient
  const v2ClientLocalName = options.v2ClientLocalName.split(".")[0];

  // Return global or service import declaration.
  return source.find(j.ImportDeclaration).filter((importDeclaration) => {
    const sourceValue = importDeclaration.value.source.value as string;

    if (
      sourceValue === PACKAGE_NAME &&
      importDeclaration.value.specifiers?.some(
        (specifier) =>
          ["ImportNamespaceSpecifier", "ImportDefaultSpecifier"].includes(specifier.type) ||
          (specifier.type === "ImportSpecifier" && specifier.local?.name === v2ClientLocalName)
      )
    ) {
      return true;
    }

    if (
      sourceValue === getClientDeepImportPath(options.v2ClientName) &&
      importDeclaration.value.specifiers?.some(
        (specifier) =>
          ["ImportNamespaceSpecifier", "ImportDefaultSpecifier"].includes(specifier.type) &&
          specifier.local?.name === v2ClientLocalName
      )
    ) {
      return true;
    }

    return false;
  });
};
