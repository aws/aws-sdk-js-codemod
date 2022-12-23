import { CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/utils/config";

export const getClientNamesSortedByPackageName = () =>
  Object.keys(CLIENT_PACKAGE_NAMES_MAP).sort((a, b) =>
    CLIENT_PACKAGE_NAMES_MAP[a].localeCompare(CLIENT_PACKAGE_NAMES_MAP[b])
  );
