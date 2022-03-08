import { API, FileInfo } from "jscodeshift";

import {
  addV3ClientModule,
  getClientMetadata,
  getV2ClientModuleNames,
  getV2ClientNames,
  getV2DefaultModuleName,
  removeDefaultModuleIfNotUsed,
  removePromiseCalls,
  removeV2ClientModule,
  replaceClientCreation,
} from "./utils";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const source = j(file.source);

  const v2DefaultModuleName = getV2DefaultModuleName(j, source);
  const v2ClientModuleNames = getV2ClientModuleNames(j, source);
  if (!v2DefaultModuleName && v2ClientModuleNames.length === 0) {
    return source.toSource();
  }

  const v2ClientNames = getV2ClientNames(j, source, { v2DefaultModuleName, v2ClientModuleNames });
  const clientMetadata = getClientMetadata(v2ClientNames);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadata).reverse()) {
    const { v3ClientName, v3ClientPackageName } = v3ClientMetadata;
    addV3ClientModule(j, source, { v2ClientName, v3ClientName, v3ClientPackageName });
    removeV2ClientModule(j, source, v2ClientName);
    removePromiseCalls(j, source, { v2DefaultModuleName, v2ClientName });
    replaceClientCreation(j, source, { v2DefaultModuleName, v2ClientName, v3ClientName });
  }

  removeDefaultModuleIfNotUsed(j, source, v2DefaultModuleName);

  return source.toSource();
}
