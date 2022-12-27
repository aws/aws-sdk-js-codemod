import { API, FileInfo } from "jscodeshift";

import {
  addV3ClientModules,
  getClientMetadata,
  getV2ClientNames,
  getV2ClientNamesFromDefault,
  getV2DefaultModuleName,
  isTypeScriptFile,
  removeDefaultModuleIfNotUsed,
  removePromiseCalls,
  removeV2ClientModule,
  replaceClientCreation,
  replaceTSTypeReference,
} from "./utils";

export default function transformer(file: FileInfo, api: API) {
  const j = isTypeScriptFile(file.path) ? api.jscodeshift.withParser("ts") : api.jscodeshift;
  const source = j(file.source);

  // ToDo: Make v2DefaultModuleName optional downstream as it can be undefined.
  // ToDo: Rename v2DefaultModuleName to v2GlobalName to align with v2ClientName.
  const v2DefaultModuleName = getV2DefaultModuleName(j, source) as string;
  const v2ClientNames = getV2ClientNames(j, source);

  if (!v2DefaultModuleName && v2ClientNames.length === 0) {
    return source.toSource();
  }

  if (v2DefaultModuleName) {
    v2ClientNames.push(...getV2ClientNamesFromDefault(j, source, v2DefaultModuleName));
  }

  const clientMetadata = getClientMetadata(v2ClientNames);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadata).reverse()) {
    const { v3ClientName, v3ClientPackageName } = v3ClientMetadata;
    addV3ClientModules(j, source, {
      v2ClientName,
      v3ClientName,
      v3ClientPackageName,
      v2DefaultModuleName,
    });
    replaceTSTypeReference(j, source, { v2ClientName, v2DefaultModuleName, v3ClientName });
    removeV2ClientModule(j, source, { v2ClientName, v2DefaultModuleName });
    removePromiseCalls(j, source, { v2ClientName, v2DefaultModuleName });
    replaceClientCreation(j, source, { v2ClientName, v2DefaultModuleName, v3ClientName });
  }

  removeDefaultModuleIfNotUsed(j, source, v2DefaultModuleName);

  return source.toSource();
}
