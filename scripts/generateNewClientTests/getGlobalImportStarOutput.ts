import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getGlobalImportStarOutput = (codegenComment: string) => {
  let globalImportOutputContent = `${codegenComment}\n`;

  globalImportOutputContent += getV3PackageImportsCode(
    getClientNamesSortedByPackageName(CLIENTS_TO_TEST)
  );
  globalImportOutputContent += `\n`;
  globalImportOutputContent += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return globalImportOutputContent;
};
