import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getServiceImportOutput = (codegenComment: string) => {
  let serviceImportOutputContent = `${codegenComment}\n`;

  serviceImportOutputContent += getV3PackageImportsCode(
    getClientNamesSortedByPackageName(CLIENTS_TO_TEST)
  );
  serviceImportOutputContent += `\n`;
  serviceImportOutputContent += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return serviceImportOutputContent;
};
