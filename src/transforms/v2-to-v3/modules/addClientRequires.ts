import { Collection, JSCodeshift } from "jscodeshift";

import {
  getClientWaiterStates,
  getV3ClientWaiterApiName,
  isS3GetSignedUrlApiUsed,
  isS3UploadApiUsed,
} from "../apis";
import { getV3ClientTypesCount } from "../ts-type";
import { addClientDefaultRequire } from "./addClientDefaultRequire";
import { addClientNamedRequire } from "./addClientNamedRequire";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getDocClientNewExpressionCount } from "./getDocClientNewExpressionCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { ClientModulesOptions } from "./types";

export const addClientRequires = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions
): void => {
  const v3ClientTypesCount = getV3ClientTypesCount(j, source, options);
  const newExpressionCount = getNewExpressionCount(j, source, options);
  const clientTSTypeRefCount = getClientTSTypeRefCount(j, source, options);
  const waiterStates = getClientWaiterStates(j, source, options);

  if (v3ClientTypesCount > 0) {
    addClientDefaultRequire(j, source, options);
  }

  if (newExpressionCount > 0 || clientTSTypeRefCount > 0) {
    addClientNamedRequire(j, source, {
      ...options,
      keyName: options.v3ClientName,
      valueName: options.v2ClientLocalName,
    });
  }

  for (const waiterState of waiterStates) {
    const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
    addClientNamedRequire(j, source, {
      ...options,
      keyName: v3WaiterApiName,
    });
  }

  if (isS3UploadApiUsed(j, source, options)) {
    addClientNamedRequire(j, source, {
      ...options,
      keyName: "Upload",
      v3ClientPackageName: "@aws-sdk/lib-storage",
    });
  }

  if (isS3GetSignedUrlApiUsed(j, source, options)) {
    addClientNamedRequire(j, source, {
      ...options,
      keyName: "getSignedUrl",
      v3ClientPackageName: "@aws-sdk/s3-request-presigner",
    });
  }

  const docClientNewExpressionCount = getDocClientNewExpressionCount(j, source, options);
  if (docClientNewExpressionCount > 0) {
    addClientNamedRequire(j, source, {
      ...options,
      keyName: "DynamoDBDocument",
      v3ClientPackageName: "@aws-sdk/lib-dynamodb",
    });
  }
};
