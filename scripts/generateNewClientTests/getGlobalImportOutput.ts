import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config/index.ts";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName.ts";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode.ts";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode.ts";

export const getGlobalImportOutput = () => {
  let content = "";

  content += getV3PackageImportsCode(getClientNamesSortedByPackageName(CLIENT_NAMES));
  content += "\n";
  content += getV3ClientsNewExpressionCode(CLIENT_NAMES);

  return content;
};
