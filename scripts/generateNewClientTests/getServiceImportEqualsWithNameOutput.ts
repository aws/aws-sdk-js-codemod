import { CLIENTS_TO_TEST } from "./config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportEqualsCode } from "./getV3PackageImportEqualsCode";

export const getServiceImportEqualsWithNameOutput = () => {
  let content = ``;

  content += getV3PackageImportEqualsCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST), {
    useLocalSuffix: true,
  });
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
