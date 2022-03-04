import { API, FileInfo } from "jscodeshift";
import findImports from "jscodeshift-find-imports";

import {
  addV3ClientImport,
  getV2ClientNames,
  getV2DefaultImport,
  getV3ClientName,
  getV3ClientPackageName,
  replaceClientCreation,
} from "./utils";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const source = j(file.source);

  const { name: v2DefaultImportName } = getV2DefaultImport(j, source);
  const v2ClientNames = getV2ClientNames(j, source, v2DefaultImportName);

  for (const v2ClientName of v2ClientNames) {
    const v3ClientName = getV3ClientName(v2ClientName);
    const v3ClientPackageName = getV3ClientPackageName(v2ClientName);
    addV3ClientImport(j, source, { v3ClientName, v3ClientPackageName });
    replaceClientCreation(j, source, {
      v2DefaultImportName,
      v2ClientName,
      v3ClientName,
    });
  }

  return source.toSource();
}
