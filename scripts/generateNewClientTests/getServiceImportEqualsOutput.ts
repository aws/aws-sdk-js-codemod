import { CLIENTS_TO_TEST } from "./config.ts";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName.ts";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode.ts";
import { getV3PackageImportEqualsCode } from "./getV3PackageImportEqualsCode.ts";

export const getServiceImportEqualsOutput = () => {
  let content = "";

  content += getV3PackageImportEqualsCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST));
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
