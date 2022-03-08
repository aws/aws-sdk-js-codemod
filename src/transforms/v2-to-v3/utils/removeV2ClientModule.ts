import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";
import { removeV2ClientImport } from "./removeV2ClientImport";

export const removeV2ClientModule = (
  j: JSCodeshift,
  source: Collection<any>,
  v2ClientName: string
) =>
  containsRequire(j, source)
    ? removeRequireIdentifierName(j, source, {
        identifierName: v2ClientName,
        literalValue: `aws-sdk/clients/${v2ClientName.toLowerCase()}`,
      })
    : removeV2ClientImport(j, source, v2ClientName);
