import { CLIENT_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequiresCode } from "./getV3PackageRequiresCode";

export const getGlobalRequireOutput = () => {
  let content = ``;

  content += getV3PackageRequiresCode(getClientNamesSortedByPackageName(CLIENTS_TO_TEST), {
    useV3ClientName: true,
  });
  content += getV3ClientsNewExpressionCode(
    CLIENTS_TO_TEST.map((clientName) => CLIENT_NAMES_MAP[clientName])
  );

  return content;
};
