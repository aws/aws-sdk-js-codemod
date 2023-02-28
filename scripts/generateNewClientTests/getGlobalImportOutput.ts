import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getGlobalImportOutput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += getV3PackageImportsCode(getClientNamesSortedByPackageName(CLIENT_NAMES));
  content += `\n`;
  content += getV3ClientsNewExpressionCode(CLIENT_NAMES);

  return content;
};
