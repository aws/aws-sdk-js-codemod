import { Collection, JSCodeshift } from "jscodeshift";

import { CLIENT_NAMES } from "./config";
import { containsRequire } from "./containsRequire";
import { getImportIdentifierName } from "./getImportIdentifierName";
import { getRequireIdentifierName } from "./getRequireIdentifierName";

export const getV2ClientModuleNames = (j: JSCodeshift, source: Collection<any>): string[] =>
  CLIENT_NAMES.map((clientName) => `aws-sdk/clients/${clientName.toLowerCase()}`)
    .map((v2ClientLiteralValue) =>
      containsRequire(j, source)
        ? getRequireIdentifierName(j, source, v2ClientLiteralValue)
        : getImportIdentifierName(j, source, v2ClientLiteralValue)
    )
    .filter((v2ClientImportLocalName) => v2ClientImportLocalName !== undefined);
