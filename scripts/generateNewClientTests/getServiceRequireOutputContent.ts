import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequireCode } from "./getV3PackageRequireCode";

export const getServiceRequireOutputContent = (codegenComment: string) => {
  let serviceImportOutputContent = `${codegenComment}\n`;

  serviceImportOutputContent += getV3PackageRequireCode(CLIENT_NAMES);
  serviceImportOutputContent += `\n`;
  serviceImportOutputContent += getV3ClientsNewExpressionCode();

  return serviceImportOutputContent;
};
