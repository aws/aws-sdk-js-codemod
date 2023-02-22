import { Collection, JSCodeshift } from "jscodeshift";

import { getClientWaiterStates, getV3ClientWaiterApiName } from "../apis";
import { getV3ClientTypesCount } from "../ts-type";
import { addV3ClientDefaultRequire } from "./addV3ClientDefaultRequire";
import { addV3ClientNamedRequire } from "./addV3ClientNamedRequire";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { V3ClientModulesOptions } from "./types";

export const addV3ClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: V3ClientModulesOptions
): void => {
  const v3ClientTypesCount = getV3ClientTypesCount(j, source, options);
  const newExpressionCount = getNewExpressionCount(j, source, options);
  const clientTSTypeRefCount = getClientTSTypeRefCount(j, source, options);
  const waiterStates = getClientWaiterStates(j, source, options);

  if (v3ClientTypesCount > 0) {
    addV3ClientDefaultRequire(j, source, options);
  }

  if (newExpressionCount > 0 || clientTSTypeRefCount > 0) {
    addV3ClientNamedRequire(j, source, {
      ...options,
      keyName: options.v3ClientName,
      valueName: options.v2ClientLocalName,
    });
  }

  for (const waiterState of waiterStates) {
    const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
    addV3ClientNamedRequire(j, source, {
      ...options,
      keyName: v3WaiterApiName,
    });
  }
};
