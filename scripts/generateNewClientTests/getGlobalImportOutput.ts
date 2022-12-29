import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getGlobalImportOutput = (codegenComment: string) => {
  let globalImportOutputContent = `${codegenComment}\n`;

  globalImportOutputContent += getV3PackageImportsCode(getClientNamesSortedByPackageName());
  globalImportOutputContent += `\n`;
  globalImportOutputContent += getV3ClientsNewExpressionCode();

  return globalImportOutputContent;
};
