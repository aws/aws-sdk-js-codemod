import { Collection, JSCodeshift } from "jscodeshift";

import {
  getClientWaiterStates,
  getS3SignedUrlApiNames,
  getV3ClientWaiterApiName,
  isS3GetSignedUrlApiUsed,
  isS3UploadApiUsed,
} from "../apis";
import { getV3ClientTypesCount } from "../ts-type";
import { addClientDefaultImport } from "./addClientDefaultImport";
import { addClientNamedImport } from "./addClientNamedImport";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getDocClientNewExpressionCount } from "./getDocClientNewExpressionCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { ClientModulesOptions } from "./types";

export const addClientImports = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions
): void => {
  const v3ClientTypesCount = getV3ClientTypesCount(j, source, options);
  const newExpressionCount = getNewExpressionCount(j, source, options);
  const clientTSTypeRefCount = getClientTSTypeRefCount(j, source, options);
  const waiterStates = getClientWaiterStates(j, source, options);

  // Add default import for types, if needed.
  if (v3ClientTypesCount > 0) {
    addClientDefaultImport(j, source, options);
  }

  if (newExpressionCount > 0 || clientTSTypeRefCount > 0) {
    addClientNamedImport(j, source, {
      ...options,
      importedName: options.v3ClientName,
      localName: options.v2ClientLocalName,
    });
  }

  for (const waiterState of waiterStates) {
    const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
    addClientNamedImport(j, source, {
      ...options,
      importedName: v3WaiterApiName,
    });
  }

  if (isS3UploadApiUsed(j, source, options)) {
    addClientNamedImport(j, source, {
      ...options,
      importedName: "Upload",
      v3ClientPackageName: "@aws-sdk/lib-storage",
    });
  }

  if (isS3GetSignedUrlApiUsed(j, source, options)) {
    addClientNamedImport(j, source, {
      ...options,
      importedName: "getSignedUrl",
      v3ClientPackageName: "@aws-sdk/s3-request-presigner",
    });
    for (const apiName of getS3SignedUrlApiNames(j, source, options)) {
      addClientNamedImport(j, source, {
        ...options,
        importedName: `${apiName[0].toUpperCase()}${apiName.slice(1)}Command`,
      });
    }
  }

  const docClientNewExpressionCount = getDocClientNewExpressionCount(j, source, options);
  if (docClientNewExpressionCount > 0) {
    addClientNamedImport(j, source, {
      ...options,
      importedName: "DynamoDBDocument",
      v3ClientPackageName: "@aws-sdk/lib-dynamodb",
    });
  }
};
