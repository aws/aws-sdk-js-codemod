import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "./config";

export const getV2ClientImportNames = (j: JSCodeshift, source: Collection<any>): string[] => {
  const v2ClientImportNames = [];

  for (const clientName of CLIENT_NAMES) {
    // Add specifier name to v2ClientImportNames if it is imported in the source.
    source
      .find(j.ImportDeclaration, {
        source: { value: `aws-sdk/clients/${clientName.toLowerCase()}` },
      })
      .forEach((declerationPath) => {
        declerationPath.value.specifiers.forEach((specifier) => {
          if (
            specifier.type === "ImportDefaultSpecifier" ||
            specifier.type === "ImportNamespaceSpecifier"
          ) {
            v2ClientImportNames.push(specifier.local.name);
          }
        });
      });
  }

  return v2ClientImportNames;
};
