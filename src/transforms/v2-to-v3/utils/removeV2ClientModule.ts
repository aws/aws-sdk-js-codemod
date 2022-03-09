import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { getV2ClientModulePath } from "./getV2ClientModulePath";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export const removeV2ClientModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientName: string
) => {
  const removeIdentifierNameOptions = {
    identifierName: v2ClientName,
    literalValue: getV2ClientModulePath(v2ClientName),
  };
  return containsRequire(j, source)
    ? removeRequireIdentifierName(j, source, removeIdentifierNameOptions)
    : removeImportIdentifierName(j, source, removeIdentifierNameOptions);
};
