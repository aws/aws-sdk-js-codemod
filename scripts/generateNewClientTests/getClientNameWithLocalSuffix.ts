import { LOCAL_NAME_SUFFIX } from "./config/index.ts";

export const getClientNameWithLocalSuffix = (clientName: string) =>
  `${clientName}${LOCAL_NAME_SUFFIX}`;
