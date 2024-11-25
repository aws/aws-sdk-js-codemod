import { CLIENTS_TO_TEST } from "./config/index.ts";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName/index.ts";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode/index.ts";
import { getV3PackageImportEqualsCode } from "./getV3PackageImportEqualsCode/index.ts";

export const getGlobalImportEqualsOutput = () => {
  let content = "";

  content += getV3PackageImportEqualsCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST));
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
