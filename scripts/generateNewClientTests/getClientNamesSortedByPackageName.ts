import { CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";

export const getClientNamesSortedByPackageName = (clientsToTest: string[]) =>
  Object.keys(
    clientsToTest.reduce((acc, clientName) => {
      acc[clientName] = CLIENT_PACKAGE_NAMES_MAP[clientName];
      return acc;
    }, {})
  ).sort((a, b) => CLIENT_PACKAGE_NAMES_MAP[a].localeCompare(CLIENT_PACKAGE_NAMES_MAP[b]));
