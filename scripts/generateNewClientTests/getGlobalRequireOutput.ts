import { CLIENTS_TO_TEST } from "./config/index.ts";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName/index.ts";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode/index.ts";
import { getV3PackageRequiresCode } from "./getV3PackageRequiresCode/index.ts";

export const getGlobalRequireOutput = () => {
  let content = "\n\n";

  content += getV3PackageRequiresCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST));
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
