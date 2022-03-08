import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export const removeV2ClientModule = (
  j: JSCodeshift,
  source: Collection<any>,
  v2ClientName: string
) => {
  const removeIdentifierNameOptions = {
    identifierName: v2ClientName,
    literalValue: `aws-sdk/clients/${v2ClientName.toLowerCase()}`,
  };
  return containsRequire(j, source)
    ? removeRequireIdentifierName(j, source, removeIdentifierNameOptions)
    : removeImportIdentifierName(j, source, removeIdentifierNameOptions);
};
