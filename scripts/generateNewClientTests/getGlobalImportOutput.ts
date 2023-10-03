import { CLIENT_NAMES, CLIENT_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getGlobalImportOutput = () => {
  let content = ``;

  content += getV3PackageImportsCode(getClientNamesSortedByPackageName(CLIENT_NAMES), {
    useV3ClientName: true,
  });
  content += `\n`;
  content += getV3ClientsNewExpressionCode(
    CLIENT_NAMES.map((clientName) => CLIENT_NAMES_MAP[clientName])
  );

  return content;
};
