import { CLIENTS_TO_TEST } from "./config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequiresCode } from "./getV3PackageRequiresCode";

export const getServiceRequireDeepWithNameOutput = () => {
  let content = ``;

  content += getV3PackageRequiresCode(CLIENTS_TO_TEST, {
    declarationPerClient: true,
    useLocalSuffix: true,
  });
  content += `\n`;
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
