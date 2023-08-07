import { API, FileInfo } from "jscodeshift";

import {
  addNotSupportedComments,
  addNotSupportedClientComments,
  removePromiseCalls,
  replaceWaiterApi,
  replaceS3UploadApi,
  replaceS3GetSignedUrlApi,
} from "./apis";
import { replaceClientCreation, replaceDocClientCreation } from "./client-instances";
import {
  getClientMetadataRecord,
  getClientNamesFromGlobal,
  getClientNamesRecord,
} from "./client-names";
import {
  addClientModules,
  getGlobalNameFromModule,
  removeClientModule,
  removeGlobalModule,
} from "./modules";
import { replaceTSTypeReference } from "./ts-type";
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

  const clientMetadataRecord = getClientMetadataRecord(j, source, v2ClientNamesRecord);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const { v2ClientLocalName } = v3ClientMetadata;
    addNotSupportedClientComments(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName });
  }

  if (source.toSource() !== file.source) {
    return source.toSource();
  }

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const { v2ClientLocalName, v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const v2Options = { v2ClientName, v2ClientLocalName, v2GlobalName };
    const v3Options = { v3ClientName, v3ClientPackageName };

    addClientModules(j, source, { ...v2Options, ...v3Options });
    replaceTSTypeReference(j, source, { ...v2Options, v3ClientName });
    removeClientModule(j, source, v2Options);
    replaceS3UploadApi(j, source, v2Options);
    removePromiseCalls(j, source, v2Options);
    replaceS3GetSignedUrlApi(j, source, v2Options);
    replaceWaiterApi(j, source, v2Options);

    replaceClientCreation(j, source, v2Options);
    replaceDocClientCreation(j, source, v2Options);
  }
  removeGlobalModule(j, source, v2GlobalName);

  return source.toSource();
};

export default transformer;

export const parser = "babylon";
