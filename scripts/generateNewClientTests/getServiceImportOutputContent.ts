import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getServiceImportOutputContent = (codegenComment: string) => {
  let globalImportOutputContent = `${codegenComment}\n`;

  globalImportOutputContent += getV3PackageImportsCode(CLIENT_NAMES);
  globalImportOutputContent += `\n`;
  globalImportOutputContent += getV3ClientsNewExpressionCode();

  return globalImportOutputContent;
};
