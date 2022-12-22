import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "../containsRequire";
import { getV2ServiceModulePath } from "../get";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export const removeV2ClientModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2ClientName: string
) => {
  const removeIdentifierNameOptions = {
    identifierName: v2ClientName,
    literalValue: getV2ServiceModulePath(v2ClientName),
  };
  return containsRequire(j, source)
    ? removeRequireIdentifierName(j, source, removeIdentifierNameOptions)
    : removeImportIdentifierName(j, source, removeIdentifierNameOptions);
};
