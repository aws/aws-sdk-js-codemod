import { PACKAGE_NAME } from "../config";

export const getClientDeepImportPath = (v2ClientName: string) =>
  `${PACKAGE_NAME}/clients/${v2ClientName.toLowerCase()}`;
