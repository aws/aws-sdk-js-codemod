import { CLIENT_PACKAGE_NAMES_MAP } from "./config";

// Returns v3 client package name for the provided v2 client name.
export const getV3ClientPackageName = (clientName: string) => {
  if (clientName in CLIENT_PACKAGE_NAMES_MAP)
    return `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[clientName]}`;
  throw new Error(`Client '${clientName}' is either deprecated or newly added.`);
};
