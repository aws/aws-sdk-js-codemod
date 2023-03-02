import { CLIENT_NAMES, PACKAGE_NAME } from "../config";

const DEEP_IMPORT_PATH_REGEXP = new RegExp(`${PACKAGE_NAME}/clients/([\\w]*)`, "g");

export const getClientNamesFromDeepImport = (fileSource: string) => {
  const clientsFromDeepImportPath = new Set(
    [...fileSource.matchAll(DEEP_IMPORT_PATH_REGEXP)].map((regExpMatch) => regExpMatch[1]).flat()
  );

  return CLIENT_NAMES.filter((clientName) =>
    clientsFromDeepImportPath.has(clientName.toLowerCase())
  );
};
