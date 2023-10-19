import { CLIENTS_TO_TEST } from "./config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequiresCode } from "./getV3PackageRequiresCode";

export const getServiceRequireDeepOutput = () => {
  let content = `\n\n`;

  content += getV3PackageRequiresCode(CLIENTS_TO_TEST);
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
