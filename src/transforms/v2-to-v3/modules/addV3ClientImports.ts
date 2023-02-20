import { Collection, JSCodeshift } from "jscodeshift";

import { getClientWaiterStates } from "../apis";
import { getV3ClientTypesCount } from "../ts-type";
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
  const v3ClientTypesCount = getV3ClientTypesCount(j, source, options);
  const newExpressionCount = getNewExpressionCount(j, source, options);
  const clientTSTypeRefCount = getClientTSTypeRefCount(j, source, options);
  const waiterStates = getClientWaiterStates(j, source, options);

  // Add default import for types, if needed.
  if (v3ClientTypesCount > 0) {
    addV3ClientDefaultImport(j, source, options);
  }

  if (newExpressionCount > 0 || clientTSTypeRefCount > 0) {
    addV3ClientNamedImport(j, source, {
      ...options,
      importedName: options.v3ClientName,
      localName: options.v2ClientLocalName,
    });
  }

  for (const waiterState of waiterStates) {
    const v3WaiterApiName = `waitUntil${waiterState[0].toUpperCase()}${waiterState.slice(1)}`;
    addV3ClientNamedImport(j, source, {
      ...options,
      importedName: v3WaiterApiName,
      localName: v3WaiterApiName,
    });
  }
};
