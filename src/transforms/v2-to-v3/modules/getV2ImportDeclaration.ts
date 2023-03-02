import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getClientDeepImportPath } from "../utils";

export interface GetV2ImportDeclarationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
}

export const getV2ImportDeclaration = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName }: GetV2ImportDeclarationOptions
) =>
  // Return global or service import declaration.
  source.find(j.ImportDeclaration).filter((importDeclaration) => {
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
      sourceValue === getClientDeepImportPath(v2ClientName) &&
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
