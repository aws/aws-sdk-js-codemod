import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "./config";

export const getV2ClientImportNames = (j: JSCodeshift, source: Collection<any>): string[] =>
  CLIENT_NAMES.map((clientName) => `aws-sdk/clients/${clientName.toLowerCase()}`)
    .map(
      (v2ClientImportSourceValue) =>
        source
          .find(j.ImportDeclaration, {
            source: { value: v2ClientImportSourceValue },
          })
          .nodes()[0]?.specifiers[0]?.local.name
    )
    .filter((v2ClientImportLocalName) => v2ClientImportLocalName !== undefined);
