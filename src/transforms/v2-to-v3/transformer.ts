import { API, FileInfo } from "jscodeshift";

import {
  addV3ClientImport,
  getClientMetadata,
  getV2ClientNames,
  getV2DefaultImportName,
  removeDefaultImportIfNotUsed,
  replaceClientCreation,
} from "./utils";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const source = j(file.source);

  const v2DefaultImportName = getV2DefaultImportName(j, source);
  if (!v2DefaultImportName) {
    return source.toSource();
  }

  const v2ClientNames = getV2ClientNames(j, source, v2DefaultImportName);
  const clientMetadata = getClientMetadata(v2ClientNames);

  const sortedClientMetadata: {
    [key: string]: { v3ClientName: string; v3ClientPackageName: string };
  } = Object.entries(clientMetadata)
    .sort(([, { v3ClientPackageName: a }], [, { v3ClientPackageName: b }]) => b.localeCompare(a))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  for (const [v2ClientName, { v3ClientName, v3ClientPackageName }] of Object.entries(
    sortedClientMetadata
  )) {
    addV3ClientImport(j, source, { v3ClientName, v3ClientPackageName });
    replaceClientCreation(j, source, {
      v2DefaultImportName,
      v2ClientName,
      v3ClientName,
    });
  }

  removeDefaultImportIfNotUsed(j, source, v2DefaultImportName);

  return source.toSource();
}
