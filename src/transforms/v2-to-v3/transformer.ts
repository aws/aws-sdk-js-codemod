import { API, FileInfo } from "jscodeshift";

import { removePromiseCalls, replaceWaiterApi } from "./apis";
import { replaceS3UploadApi } from "./apis/replaceS3UploadApi";
import { replaceClientCreation } from "./client-instances";
import {
  getClientMetadataRecord,
  getV2ClientNamesFromGlobal,
  getV2ClientNamesRecord,
} from "./client-names";
import {
  addV3ClientModules,
  getV2GlobalNameFromModule,
  removeV2ClientModule,
  removeV2GlobalModule,
} from "./modules";
import { replaceTSTypeReference } from "./ts-type";
import { isTypeScriptFile } from "./utils";

const transformer = async (file: FileInfo, api: API) => {
  const j = isTypeScriptFile(file.path) ? api.jscodeshift.withParser("ts") : api.jscodeshift;
  const source = j(file.source);

  const v2GlobalName = getV2GlobalNameFromModule(j, source);
  const v2ClientNamesRecord = getV2ClientNamesRecord(j, source);

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
  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadataRecord)) {
    const { v2ClientLocalName, v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const v2Options = { v2ClientName, v2ClientLocalName, v2GlobalName };
    const v3Options = { v3ClientName, v3ClientPackageName };

    addV3ClientModules(j, source, { ...v2Options, ...v3Options });
    replaceTSTypeReference(j, source, { ...v2Options, v3ClientName });
    removeV2ClientModule(j, source, v2Options);
    replaceS3UploadApi(j, source, v2Options);
    removePromiseCalls(j, source, v2Options);
    replaceWaiterApi(j, source, v2Options);

    if (v2GlobalName) {
      replaceClientCreation(j, source, { v2ClientName, v2ClientLocalName, v2GlobalName });
    }
  }

  if (v2GlobalName) {
    removeV2GlobalModule(j, source, v2GlobalName);
  }

  return source.toSource();
};

export default transformer;

export const parser = "babylon";
