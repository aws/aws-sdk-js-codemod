import { CLIENT_NAMES, PACKAGE_NAME } from "../config";

const SERVICE_MODULE_PATH_REGEXP = new RegExp(`${PACKAGE_NAME}/clients/([\\w]*)`, "g");

export const getV2ClientNamesWithServiceModule = (fileSource: string) => {
  const clientsFromServiceModule = new Set(
    [...fileSource.matchAll(SERVICE_MODULE_PATH_REGEXP)].map((regExpMatch) => regExpMatch[1]).flat()
  );

  return CLIENT_NAMES.filter((clientName) =>
    clientsFromServiceModule.has(clientName.toLowerCase())
  );
};
