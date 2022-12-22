import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequireCode } from "./getV3PackageRequireCode";

export const getGlobalRequireOutputContent = (codegenComment: string) => {
  let globalImportOutputContent = `${codegenComment}\n`;

  globalImportOutputContent += getV3PackageRequireCode();
  globalImportOutputContent += getV3ClientsNewExpressionCode();

  return globalImportOutputContent;
};
