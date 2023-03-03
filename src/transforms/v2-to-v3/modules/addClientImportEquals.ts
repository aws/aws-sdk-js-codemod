import { Collection, JSCodeshift } from "jscodeshift";

import { getClientWaiterStates, getV3ClientWaiterApiName, isS3UploadApiUsed } from "../apis";
import { getV3ClientTypesCount } from "../ts-type";
import { addClientDefaultImportEquals } from "./addClientDefaultImportEquals";
import { addClientNamedImportEquals } from "./addClientNamedImportEquals";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getDocClientNewExpressionCount } from "./getDocClientNewExpressionCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { ClientModulesOptions } from "./types";

export const addClientImportEquals = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions
): void => {
  const v3ClientTypesCount = getV3ClientTypesCount(j, source, options);
  const newExpressionCount = getNewExpressionCount(j, source, options);
  const clientTSTypeRefCount = getClientTSTypeRefCount(j, source, options);
  const waiterStates = getClientWaiterStates(j, source, options);

  if (v3ClientTypesCount > 0) {
    addClientDefaultImportEquals(j, source, options);
  }

  if (newExpressionCount > 0 || clientTSTypeRefCount > 0) {
    addClientNamedImportEquals(j, source, {
      ...options,
      keyName: options.v3ClientName,
      valueName: options.v2ClientLocalName,
    });
  }

  for (const waiterState of waiterStates) {
    const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
    addClientNamedImportEquals(j, source, {
      ...options,
      keyName: v3WaiterApiName,
    });
  }

  if (isS3UploadApiUsed(j, source, options)) {
    addClientNamedImportEquals(j, source, {
      ...options,
      keyName: "Upload",
      v3ClientPackageName: "@aws-sdk/lib-storage",
    });
  }

  const docClientNewExpressionCount = getDocClientNewExpressionCount(j, source, options);
  if (docClientNewExpressionCount > 0) {
    addClientNamedImportEquals(j, source, {
      ...options,
      keyName: "DynamoDBDocument",
      v3ClientPackageName: "@aws-sdk/lib-dynamodb",
    });
  }
};
