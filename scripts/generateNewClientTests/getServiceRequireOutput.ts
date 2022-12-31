import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequireCode } from "./getV3PackageRequireCode";

export const getServiceRequireOutput = (codegenComment: string) => {
  let serviceRequireOutputContent = `${codegenComment}\n`;

  serviceRequireOutputContent += getV3PackageRequireCode(CLIENT_NAMES);
  serviceRequireOutputContent += `\n`;
  serviceRequireOutputContent += getV3ClientsNewExpressionCode();

  return serviceRequireOutputContent;
};
