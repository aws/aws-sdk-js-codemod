import { CLIENT_NAMES, PACKAGE_NAME } from "../config/index.ts";

const DEEP_IMPORT_PATH_REGEXP = new RegExp(`${PACKAGE_NAME}/clients/([\\w]*)`, "g");

export const getClientNamesFromDeepImport = (fileSource: string) => {
  const clientsFromDeepImportPath = new Set(
    [...fileSource.matchAll(DEEP_IMPORT_PATH_REGEXP)].flatMap((regExpMatch) => regExpMatch[1])
  );

  return CLIENT_NAMES.filter((clientName) =>
    clientsFromDeepImportPath.has(clientName.toLowerCase())
  );
};
