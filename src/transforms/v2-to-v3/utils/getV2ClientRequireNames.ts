import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "./config";

export const getV2ClientRequireNames = (j: JSCodeshift, source: Collection<any>): string[] =>
  CLIENT_NAMES.map((clientName) => `aws-sdk/clients/${clientName.toLowerCase()}`)
    .map(
      (v2ClientImportSourceValue) =>
        (
          source
            .find(j.VariableDeclarator, {
              id: { type: "Identifier" },
              init: {
                type: "CallExpression",
                callee: { type: "Identifier", name: "require" },
                arguments: [{ type: "Literal", value: v2ClientImportSourceValue }],
              },
            })
            .nodes()[0]?.id as Identifier
        )?.name
    )
    .filter((v2ClientImportLocalName) => v2ClientImportLocalName !== undefined);
