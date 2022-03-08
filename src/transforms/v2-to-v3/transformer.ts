import { API, FileInfo } from "jscodeshift";

import {
  addV3ClientModule,
  getClientMetadata,
  getV2ClientImportNames,
  getV2ClientNames,
  getV2DefaultImportName,
  removeDefaultModuleIfNotUsed,
  removePromiseCalls,
  removeV2ClientImport,
  replaceClientCreation,
} from "./utils";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const source = j(file.source);

  const v2DefaultImportName = getV2DefaultImportName(j, source);
  const v2ClientImportNames = getV2ClientImportNames(j, source);
  if (!v2DefaultImportName && v2ClientImportNames.length === 0) {
    return source.toSource();
  }

  const v2ClientNames = getV2ClientNames(j, source, { v2DefaultImportName, v2ClientImportNames });
  const clientMetadata = getClientMetadata(v2ClientNames);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadata).reverse()) {
    const { v3ClientName, v3ClientPackageName } = v3ClientMetadata;
    addV3ClientModule(j, source, { v2ClientName, v3ClientName, v3ClientPackageName });
    removeV2ClientImport(j, source, v2ClientName);
    removePromiseCalls(j, source, { v2DefaultImportName, v2ClientName });
    replaceClientCreation(j, source, { v2DefaultImportName, v2ClientName, v3ClientName });
  }

  removeDefaultModuleIfNotUsed(j, source, v2DefaultImportName);

  return source.toSource();
}
