import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ClientTypeNames, isV2ClientInputOutputType } from "../ts-type";
import { getV2ServiceModulePath } from "../utils";
import { hasRequire } from "./hasRequire";
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
  const sourceValues = [PACKAGE_NAME, getV2ServiceModulePath(v2ClientName)];

  if (hasRequire(j, source)) {
    sourceValues.forEach((sourceValue) => {
      removeRequireIdentifierName(j, source, {
        localName: v2ClientLocalName,
        sourceValue,
      });
    });
  } else {
    sourceValues.forEach((sourceValue) => {
      removeImportIdentifierName(j, source, {
        localName: v2ClientLocalName,
        sourceValue,
      });
    });

    const v2ClientTypeNames = getV2ClientTypeNames(j, source, options);
    for (const v2ClientTypeName of v2ClientTypeNames) {
      if (isV2ClientInputOutputType(v2ClientTypeName)) {
        sourceValues.forEach((sourceValue) => {
          removeImportIdentifierName(j, source, {
            localName: v2ClientTypeName,
            sourceValue,
          });
        });
      }
    }
  }
};
