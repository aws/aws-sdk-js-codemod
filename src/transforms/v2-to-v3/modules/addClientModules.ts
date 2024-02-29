import { Collection, JSCodeshift } from "jscodeshift";

import {
  getClientWaiterStates,
  getCommandName,
  getS3SignedUrlApiNames,
  getV3ClientWaiterApiName,
  isS3GetSignedUrlApiUsed,
  isS3UploadApiUsed,
} from "../apis";
import {
  DOCUMENT_CLIENT,
  DYNAMODB,
  DYNAMODB_DOCUMENT,
  DYNAMODB_DOCUMENT_CLIENT,
  S3,
} from "../config";
import { getV3ClientTypes } from "../ts-type";
import { addNamedModule } from "./addNamedModule";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getNewExpressionCount } from "./getNewExpressionCount";

import { ClientModulesOptions } from "./types";

export const addClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions
): void => {
  const {
    clientIdentifiers,
    v2ClientName,
    v3ClientName,
    v3ClientPackageName,
    v2ClientLocalName,
    importType,
  } = options;

  const v3ClientTypes = getV3ClientTypes(j, source, options);
  const newExpressionCount = getNewExpressionCount(j, source, options);
  const clientTSTypeRefCount = getClientTSTypeRefCount(j, source, options);
  const waiterStates = getClientWaiterStates(j, source, clientIdentifiers);

  // Add named import for types, if needed.
  for (const v3ClientType of v3ClientTypes) {
    addNamedModule(j, source, {
      importType,
      localName: v3ClientType,
      packageName: v3ClientPackageName,
    });
  }

  if (newExpressionCount > 0 || clientTSTypeRefCount > 0) {
    addNamedModule(j, source, {
      importType,
      importedName: v3ClientName,
      localName: v2ClientName === v2ClientLocalName ? v3ClientName : v2ClientLocalName,
      packageName: v3ClientPackageName,
    });
  }

  for (const waiterState of waiterStates) {
    const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
    addNamedModule(j, source, {
      importType,
      localName: v3WaiterApiName,
      packageName: v3ClientPackageName,
    });
  }

  if (v2ClientName === S3) {
    if (isS3UploadApiUsed(j, source, clientIdentifiers)) {
      addNamedModule(j, source, {
        importType,
        localName: "Upload",
        packageName: "@aws-sdk/lib-storage",
      });
    }

    if (isS3GetSignedUrlApiUsed(j, source, clientIdentifiers)) {
      addNamedModule(j, source, {
        importType,
        localName: "getSignedUrl",
        packageName: "@aws-sdk/s3-request-presigner",
      });
      for (const apiName of getS3SignedUrlApiNames(j, source, clientIdentifiers)) {
        addNamedModule(j, source, {
          importType,
          localName: getCommandName(apiName),
          packageName: v3ClientPackageName,
        });
      }
    }
  }

  if (v2ClientName === DYNAMODB) {
    const { v2ClientLocalName } = options;

    const docClientOptions = {
      ...options,
      v2ClientName: DYNAMODB_DOCUMENT_CLIENT,
      ...(v2ClientLocalName && {
        v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}`,
      }),
    };

    const docClientTypes = getV3ClientTypes(j, source, docClientOptions);
    const docClientNewExpressionCount = getNewExpressionCount(j, source, docClientOptions);

    // Add named import for types, if needed.
    for (const docClientType of docClientTypes) {
      addNamedModule(j, source, {
        importType,
        localName: docClientType,
        packageName: "@aws-sdk/lib-dynamodb",
      });
    }

    if (docClientNewExpressionCount > 0) {
      addNamedModule(j, source, {
        importType,
        localName: DYNAMODB_DOCUMENT,
        packageName: "@aws-sdk/lib-dynamodb",
      });
    }
  }
};
