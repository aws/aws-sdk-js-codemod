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
import { getV3ClientTypesCount } from "../ts-type";
import { getClientTSTypeRefCount } from "./getClientTSTypeRefCount";
import { getNewExpressionCount } from "./getNewExpressionCount";
import { hasImportEquals } from "./hasImportEquals";
import { hasRequire } from "./hasRequire";

import * as importEqualsModule from "./importEqualsModule";
import * as importModule from "./importModule";
import * as requireModule from "./requireModule";
import { ClientModulesOptions } from "./types";

export const addClientModules = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: ClientModulesOptions
): void => {
  const { clientIdentifiers } = options;

  const { addClientDefaultModule, addClientNamedModule } = hasRequire(j, source)
    ? requireModule
    : hasImportEquals(j, source)
    ? importEqualsModule
    : importModule;

  const v3ClientTypesCount = getV3ClientTypesCount(j, source, options);
  const newExpressionCount = getNewExpressionCount(j, source, options);
  const clientTSTypeRefCount = getClientTSTypeRefCount(j, source, options);
  const waiterStates = getClientWaiterStates(j, source, clientIdentifiers);

  // Add default import for types, if needed.
  if (v3ClientTypesCount > 0) {
    addClientDefaultModule(j, source, options);
  }

  if (newExpressionCount > 0 || clientTSTypeRefCount > 0) {
    addClientNamedModule(j, source, {
      ...options,
      importedName: options.v3ClientName,
      localName: options.v2ClientLocalName,
    });
  }

  for (const waiterState of waiterStates) {
    const v3WaiterApiName = getV3ClientWaiterApiName(waiterState);
    addClientNamedModule(j, source, {
      ...options,
      importedName: v3WaiterApiName,
    });
  }

  if (isS3UploadApiUsed(j, source, options)) {
    addClientNamedModule(j, source, {
      ...options,
      importedName: "Upload",
      v3ClientPackageName: "@aws-sdk/lib-storage",
    });
  }

  if (options.v2ClientName === S3 && isS3GetSignedUrlApiUsed(j, source, clientIdentifiers)) {
    addClientNamedModule(j, source, {
      ...options,
      importedName: "getSignedUrl",
      v3ClientPackageName: "@aws-sdk/s3-request-presigner",
    });
    for (const apiName of getS3SignedUrlApiNames(j, source, clientIdentifiers)) {
      addClientNamedModule(j, source, {
        ...options,
        importedName: getCommandName(apiName),
      });
    }
  }

  if (options.v2ClientName === DYNAMODB) {
    const { v2ClientLocalName } = options;

    const docClientOptions = {
      ...options,
      v2ClientName: DYNAMODB_DOCUMENT_CLIENT,
      ...(v2ClientLocalName && {
        v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}`,
      }),
    };

    const docClientTypesCount = getV3ClientTypesCount(j, source, docClientOptions);
    const docClientNewExpressionCount = getNewExpressionCount(j, source, docClientOptions);

    const docClientModuleOptions = {
      ...options,
      v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}`,
      v3ClientPackageName: "@aws-sdk/lib-dynamodb",
    };

    // Add default import for types, if needed.
    if (docClientTypesCount > 0) {
      addClientDefaultModule(j, source, docClientModuleOptions);
    }

    if (docClientNewExpressionCount > 0) {
      addClientNamedModule(j, source, {
        ...docClientModuleOptions,
        importedName: DYNAMODB_DOCUMENT,
      });
    }
  }
};
