import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3ImportEqualsCode } from "./getV3ImportEqualsCode";

export const getGlobalImportEqualsOutput = (codegenComment: string) => {
  let content = `${codegenComment};\n`;

  content += getV3ImportEqualsCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST));
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
