import { API, FileInfo } from "jscodeshift";

import {
  addV3ClientModules,
  getClientMetadata,
  getV2ClientNames,
  getV2DefaultModuleName,
  getV2ServiceModuleNames,
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

  const v2DefaultModuleName = getV2DefaultModuleName(j, source) as string;
  const v2ServiceModuleNames = getV2ServiceModuleNames(j, source);
  if (!v2DefaultModuleName && v2ServiceModuleNames.length === 0) {
    return source.toSource();
  }

  const v2ClientNames = getV2ClientNames(j, source, { v2DefaultModuleName, v2ServiceModuleNames });
  const clientMetadata = getClientMetadata(v2ClientNames);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadata).reverse()) {
    const { v3ClientName, v3ClientPackageName } = v3ClientMetadata;
    addV3ClientModules(j, source, {
      v2ClientName,
      v3ClientName,
      v3ClientPackageName,
      v2DefaultModuleName,
    });
    removeV2ClientModule(j, source, v2ClientName);
    removePromiseCalls(j, source, { v2DefaultModuleName, v2ClientName });
    replaceClientCreation(j, source, { v2DefaultModuleName, v2ClientName, v3ClientName });
    replaceTSTypeReference(j, source, { v2DefaultModuleName, v2ClientName, v3ClientName });
  }

  removeDefaultModuleIfNotUsed(j, source, v2DefaultModuleName);

  return source.toSource();
}
