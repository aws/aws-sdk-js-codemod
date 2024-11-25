import { CLIENTS_TO_TEST } from "./config/index.ts";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName/index.ts";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode/index.ts";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode/index.ts";

export const getServiceImportDeepOutput = () => {
  let content = "";

  content += getV3PackageImportsCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST));
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
