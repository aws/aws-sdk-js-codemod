import { LOCAL_NAME_SUFFIX } from "./config.ts";

export const getClientNameWithLocalSuffix = (clientName: string) =>
  `${clientName}${LOCAL_NAME_SUFFIX}`;
