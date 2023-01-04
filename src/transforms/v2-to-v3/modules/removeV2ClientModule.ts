import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ClientTypeNames } from "../ts-type";
import { getV2ServiceModulePath } from "../utils";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";
import { removeImportDefault } from "./removeImportDefault";
import { removeImportEqualsIdentifierName } from "./removeImportEqualsIdentifierName";
import { removeImportNamed } from "./removeImportNamed";
import { removeRequireIdentifier } from "./removeRequireIdentifier";
import { removeRequireObjectProperty } from "./removeRequireObjectProperty";

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

  const defaultOptions = {
    localName: v2ClientLocalName,
    sourceValue: serviceModulePath,
  };
  const namedOptions = {
    localName: v2ClientLocalName,
    sourceValue: PACKAGE_NAME,
  };

  if (hasRequire(j, source)) {
    removeRequireIdentifier(j, source, defaultOptions);
    removeRequireObjectProperty(j, source, namedOptions);
  } else if (hasImportEquals(j, source)) {
    removeImportEqualsIdentifierName(j, source, defaultOptions);
  } else {
    removeImportDefault(j, source, defaultOptions);
    removeImportNamed(j, source, namedOptions);

    const v2ClientTypeNames = getV2ClientTypeNames(j, source, options);
    for (const v2ClientTypeName of v2ClientTypeNames) {
      removeImportNamed(j, source, {
        localName: v2ClientTypeName,
        sourceValue: serviceModulePath,
      });
    }
  }
};
