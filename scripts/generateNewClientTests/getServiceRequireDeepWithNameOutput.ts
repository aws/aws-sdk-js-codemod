import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequiresCode } from "./getV3PackageRequiresCode";

export const getServiceRequireDeepWithNameOutput = () => {
  let content = "\n\n";

  content += getV3PackageRequiresCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST), {
    useLocalSuffix: true,
  });
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
