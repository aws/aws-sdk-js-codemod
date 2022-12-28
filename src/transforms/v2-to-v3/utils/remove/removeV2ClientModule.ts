import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "../containsRequire";
import { getV2ClientTypeNames, getV2ServiceModulePath } from "../get";
import { isV2ClientInputOutputType } from "../isV2ClientInputOutputType";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifierName } from "./removeRequireIdentifierName";

export interface RemoveV2ClientModuleOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const removeV2ClientModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: RemoveV2ClientModuleOptions
) => {
  const { v2ClientName, v2ClientLocalName } = options;
  const literalValue = getV2ServiceModulePath(v2ClientName);
  const removeIdentifierNameOptions = {
    localName: v2ClientLocalName,
    literalValue,
  };

  if (containsRequire(j, source)) {
    removeRequireIdentifierName(j, source, removeIdentifierNameOptions);
  } else {
    removeImportIdentifierName(j, source, removeIdentifierNameOptions);

    const v2ClientTypeNames = getV2ClientTypeNames(j, source, options);
    for (const v2ClientTypeName of v2ClientTypeNames) {
      if (isV2ClientInputOutputType(v2ClientTypeName)) {
        removeImportIdentifierName(j, source, {
          localName: v2ClientTypeName,
          literalValue,
        });
      }
    }
  }
};
