import { Collection, JSCodeshift } from "jscodeshift";

import { getV3ClientTypeNames } from "../ts-type";
import { addV3ClientDefaultImport } from "./addV3ClientDefaultImport";
import { addV3ClientNamedImport } from "./addV3ClientNamedImport";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientImports = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void => {
  const { v2ClientLocalName, v2ClientName, v2GlobalName } = options;
  const v3ClientTypeNames = getV3ClientTypeNames(j, source, {
    v2ClientLocalName,
    v2ClientName,
    v2GlobalName,
  });

  // Add default import for types, if needed.
  if (v3ClientTypeNames.length > 0) {
    addV3ClientDefaultImport(j, source, options);
  }

  if (
    getNewExpressionCount(j, source, options) > 0 ||
    getClientTSTypeRefCount(j, source, options) > 0
  ) {
    addV3ClientNamedImport(j, source, options);
  }
};
