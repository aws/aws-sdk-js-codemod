import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getServiceImportOutput = (codegenComment: string) => {
  let serviceImportOutputContent = `${codegenComment}\n`;

  serviceImportOutputContent += getV3PackageImportsCode(CLIENT_NAMES);
  serviceImportOutputContent += `\n`;
  serviceImportOutputContent += getV3ClientsNewExpressionCode();

  return serviceImportOutputContent;
};
