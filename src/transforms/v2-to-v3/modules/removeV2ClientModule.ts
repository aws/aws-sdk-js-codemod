import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ClientTypeNames } from "../ts-type";
import { getV2ServiceModulePath } from "../utils";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { removeImportEqualsIdentifierName } from "./removeImportEqualsIdentifierName";
import { removeImportIdentifierName } from "./removeImportIdentifierName";
import { removeRequireIdentifier } from "./removeRequireIdentifier";
import { removeRequireObjectPattern } from "./removeRequireObjectPattern";

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
  const serviceModulePath = getV2ServiceModulePath(v2ClientName);
  const sourceValues = [PACKAGE_NAME, serviceModulePath];

  if (hasRequire(j, source)) {
    removeRequireIdentifier(j, source, {
      localName: v2ClientLocalName,
      sourceValue: serviceModulePath,
    });
    removeRequireObjectPattern(j, source, {
      localName: v2ClientLocalName,
      sourceValue: PACKAGE_NAME,
    });
  } else if (hasImportEquals(j, source)) {
    removeImportEqualsIdentifierName(j, source, {
      localName: v2ClientLocalName,
      sourceValue: serviceModulePath,
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
      sourceValues.forEach((sourceValue) => {
        removeImportIdentifierName(j, source, {
          localName: v2ClientTypeName,
          sourceValue,
        });
      });
    }
  }
};
