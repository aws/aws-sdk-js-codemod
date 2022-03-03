import { CLIENT_NAMES_MAP } from "./config";

// Returns v3 client name for the provided v2 client name.
export const getV3ClientName = (clientName: string) => {
  if (clientName in CLIENT_NAMES_MAP) return CLIENT_NAMES_MAP[clientName];
  throw new Error(`Client '${clientName}' is either deprecated or newly added.`);
};
