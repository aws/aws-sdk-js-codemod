import { PACKAGE_NAME_V2 } from "../config";

export const getClientDeepImportPath = (v2ClientName: string) =>
  `${PACKAGE_NAME_V2}/clients/${v2ClientName.toLowerCase()}`;
