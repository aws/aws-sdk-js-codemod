import { LOCAL_NAME_SUFFIX } from "./config";

export const getClientNamesWithLocalSuffix = (clientNames: string[]) =>
  clientNames.map((clientName) => `${clientName}${LOCAL_NAME_SUFFIX}`);
