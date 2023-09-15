import { API, FileInfo } from "jscodeshift";

import {
  addNotSupportedComments,
  addNotSupportedClientComments,
  removePromiseCalls,
  replaceWaiterApi,
  replaceS3UploadApi,
  replaceS3GetSignedUrlApi,
  getClientIdentifiersRecord,
} from "./apis";
import { replaceAwsUtilFunctions } from "./aws-util";
import { replaceClientCreation, replaceDocClientCreation } from "./client-instances";
import {
  getClientMetadataRecord,
  getClientNamesFromGlobal,
  getClientNamesRecord,
} from "./client-names";
import { S3 } from "./config";
import {
  addClientModules,
  getGlobalNameFromModule,
  removeClientModule,
  removeGlobalModule,
} from "./modules";
import { replaceTSQualifiedName } from "./ts-type";
import { isTypeScriptFile } from "./utils";

const transformer = async (file: FileInfo, api: API) => {
  const j = isTypeScriptFile(file.path) ? api.jscodeshift.withParser("ts") : api.jscodeshift;
  const source = j(file.source);

  addNotSupportedComments(j, source);

  const v2GlobalName = getGlobalNameFromModule(j, source);
  const v2ClientNamesRecord = getClientNamesRecord(j, source);

  if (!v2GlobalName && Object.keys(v2ClientNamesRecord).length === 0) {
    return source.toSource();
  }

  if (v2GlobalName) {
    for (const v2ClientNameFromGlobal of getClientNamesFromGlobal(j, source, v2GlobalName)) {
      if (!(v2ClientNameFromGlobal in v2ClientNamesRecord)) {
        v2ClientNamesRecord[v2ClientNameFromGlobal] = v2ClientNameFromGlobal;
      }
    }
  }

  const clientMetadataRecord = getClientMetadataRecord(v2ClientNamesRecord);
  const clientIdentifiersRecord = getClientIdentifiersRecord(j, source, {
    v2GlobalName,
    v2ClientNamesRecord,
  });

  for (const v2ClientName of Object.keys(clientMetadataRecord)) {
    const clientIdentifiers = clientIdentifiersRecord[v2ClientName];
    addNotSupportedClientComments(j, source, { v2ClientName, clientIdentifiers });
  }

  if (source.toSource() !== file.source) {
    return source.toSource();
  }

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const clientIdentifiers = clientIdentifiersRecord[v2ClientName];
    const { v2ClientLocalName, v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const v2Options = { v2ClientName, v2ClientLocalName, v2GlobalName };
    const v3Options = { v3ClientName, v3ClientPackageName };

    addClientModules(j, source, { ...v2Options, ...v3Options, clientIdentifiers });
    replaceTSQualifiedName(j, source, { ...v2Options, v3ClientName });
    removeClientModule(j, source, v2Options);

    if (v2ClientName === S3) {
      // Needs to be called before removing promise calls, as replacement has `.done()` call.
      replaceS3UploadApi(j, source, clientIdentifiers);
    }

    removePromiseCalls(j, source, clientIdentifiers);

    if (v2ClientName === S3) {
      replaceS3GetSignedUrlApi(j, source, clientIdentifiers);
    }

    replaceWaiterApi(j, source, clientIdentifiers);

    replaceClientCreation(j, source, v2Options);
    replaceDocClientCreation(j, source, v2Options);
  }
  replaceAwsUtilFunctions(j, source, v2GlobalName);
  removeGlobalModule(j, source, v2GlobalName);

  return source.toSource();
};

export default transformer;

export const parser = "babylon";
