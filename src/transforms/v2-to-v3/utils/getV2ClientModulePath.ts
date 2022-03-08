import { PACKAGE_NAME } from "./config";

export const getV2ClientModulePath = (v2ClientName: string) =>
  `${PACKAGE_NAME}/clients/${v2ClientName.toLowerCase()}`;
