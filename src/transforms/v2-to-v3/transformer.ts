import { API, FileInfo } from "jscodeshift";

import {
  addV3ClientModules,
  getClientMetadata,
  getV2ClientNames,
  getV2ClientNamesFromDefault,
  getV2GlobalName,
  isTypeScriptFile,
  removePromiseCalls,
  removeV2ClientModule,
  removeV2GlobalModule,
  replaceClientCreation,
  replaceTSTypeReference,
} from "./utils";

export default function transformer(file: FileInfo, api: API) {
  const j = isTypeScriptFile(file.path) ? api.jscodeshift.withParser("ts") : api.jscodeshift;
  const source = j(file.source);

  // ToDo: Make v2GlobalName optional downstream as it can be undefined.
  const v2GlobalName = getV2GlobalName(j, source) as string;
  const v2ClientNames = getV2ClientNames(j, source);

  if (!v2GlobalName && v2ClientNames.length === 0) {
    return source.toSource();
  }

  if (v2GlobalName) {
    v2ClientNames.push(...getV2ClientNamesFromDefault(j, source, v2GlobalName));
  }

  const clientMetadata = getClientMetadata(v2ClientNames);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadata).reverse()) {
    const { v3ClientName, v3ClientPackageName } = v3ClientMetadata;

    const v2Options = { v2ClientName, v2GlobalName };
    const v3Options = { v3ClientName, v3ClientPackageName };

    addV3ClientModules(j, source, { ...v2Options, ...v3Options });
    replaceTSTypeReference(j, source, { ...v2Options, v3ClientName });
    removeV2ClientModule(j, source, v2Options);
    removePromiseCalls(j, source, v2Options);
    replaceClientCreation(j, source, { ...v2Options, v3ClientName });
  }

  removeV2GlobalModule(j, source, v2GlobalName);

  return source.toSource();
}
