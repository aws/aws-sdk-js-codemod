import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportEqualsCode } from "./getV3PackageImportEqualsCode";

export const getGlobalImportEqualsOutput = (codegenComment: string) => {
  let content = `${codegenComment};\n`;

  content += getV3PackageImportEqualsCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST));
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
