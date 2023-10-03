import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequiresCode } from "./getV3PackageRequiresCode";

export const getServiceRequireOutput = () => {
  let content = ``;

  content += getV3PackageRequiresCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST));
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
