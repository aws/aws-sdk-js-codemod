import { CLIENTS_TO_TEST } from "./config.ts";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName.ts";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix.ts";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode.ts";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode.ts";

export const getServiceImportWithNameOutput = () => {
  let content = "";

  content += getV3PackageImportsCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST), {
    useLocalSuffix: true,
  });
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
