import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequireCode } from "./getV3PackageRequireCode";

export const getGlobalRequireOutputContent = (codegenComment: string) => {
  let globalImportOutputContent = `${codegenComment}\n\n`;

  globalImportOutputContent += getV3PackageRequireCode(getClientNamesSortedByPackageName(), {
    extraNewLine: true,
  });
  globalImportOutputContent += getV3ClientsNewExpressionCode();

  return globalImportOutputContent;
};
