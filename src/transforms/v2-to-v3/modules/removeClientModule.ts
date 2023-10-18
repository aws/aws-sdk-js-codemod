import { Collection, JSCodeshift } from "jscodeshift";

import { PACKAGE_NAME_V2 } from "../config";
import { getClientTypeNames } from "../ts-type";
import { getClientDeepImportPath } from "../utils";
import { removeImportDefault } from "./removeImportDefault";
import { removeImportEquals } from "./removeImportEquals";
import { removeImportNamed } from "./removeImportNamed";
import { removeRequireIdentifier } from "./removeRequireIdentifier";
import { removeRequireObjectProperty } from "./removeRequireObjectProperty";
import { removeRequireProperty } from "./removeRequireProperty";
import { ImportType } from "./types";

export interface RemoveClientModuleOptions {
  importType: ImportType;
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const removeClientModule = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: RemoveClientModuleOptions
) => {
  const { importType, v2ClientName, v2ClientLocalName } = options;
  const deepImportPath = getClientDeepImportPath(v2ClientName);

  const defaultOptions = { localName: v2ClientLocalName, sourceValue: deepImportPath };
  const namedOptions = { localName: v2ClientLocalName, sourceValue: PACKAGE_NAME_V2 };

  if (importType === ImportType.REQUIRE) {
    removeRequireIdentifier(j, source, defaultOptions);
    removeRequireObjectProperty(j, source, namedOptions);
    removeRequireProperty(j, source, { ...namedOptions, propertyName: v2ClientName });
  } else if (importType === ImportType.IMPORT_EQUALS) {
    removeImportEquals(j, source, defaultOptions);
  } else {
    removeImportDefault(j, source, defaultOptions);
    removeImportNamed(j, source, namedOptions);

    const clientTypeNames = getClientTypeNames(j, source, options);
    for (const clientTypeName of clientTypeNames) {
      removeImportNamed(j, source, {
        localName: clientTypeName,
        sourceValue: deepImportPath,
      });
    }
  }
};
