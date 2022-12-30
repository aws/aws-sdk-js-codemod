import { API, FileInfo } from "jscodeshift";

import {
  addV3ClientModules,
  getClientMetadataRecord,
  getV2ClientNamesFromGlobal,
  getV2ClientNamesRecord,
  getV2ClientNamesWithServiceModule,
  getV2GlobalName,
  isTypeScriptFile,
  removePromiseCalls,
  removeV2ClientModule,
  removeV2GlobalModule,
  replaceClientCreation,
  replaceTSTypeReference,
} from "./utils";

const transformer = async (file: FileInfo, api: API) => {
  const j = isTypeScriptFile(file.path) ? api.jscodeshift.withParser("ts") : api.jscodeshift;
  const source = j(file.source);

  const v2GlobalName = getV2GlobalName(j, source);
  const v2ClientNamesWithServiceModule = getV2ClientNamesWithServiceModule(file.source);
  const v2ClientNamesRecord = getV2ClientNamesRecord(j, source, v2ClientNamesWithServiceModule);

  if (!v2GlobalName && Object.keys(v2ClientNamesRecord).length === 0) {
    return source.toSource();
  }

  if (v2GlobalName) {
    for (const v2ClientNameFromGlobal of getV2ClientNamesFromGlobal(j, source, v2GlobalName)) {
      if (!(v2ClientNameFromGlobal in v2ClientNamesRecord)) {
        v2ClientNamesRecord[v2ClientNameFromGlobal] = v2ClientNameFromGlobal;
      }
    }
  }

  const clientMetadataRecord = getClientMetadataRecord(v2ClientNamesRecord);

  addV3ClientModules(j, source, clientMetadataRecord);
  replaceTSTypeReference(j, source, clientMetadataRecord);
  removeV2ClientModule(j, source, clientMetadataRecord);
  removePromiseCalls(j, source, clientMetadataRecord);

  if (v2GlobalName) {
    replaceClientCreation(j, source, clientMetadataRecord);
    removeV2GlobalModule(j, source, v2GlobalName);
  }

  return source.toSource();
};

export default transformer;
