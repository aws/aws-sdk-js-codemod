import { LOCAL_NAME_SUFFIX } from "./config";

export const getClientNameWithLocalSuffix = (clientName: string) =>
  `${clientName}${LOCAL_NAME_SUFFIX}`;
