import { CLIENT_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { CLIENTS_TO_TEST } from "./config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getServiceImportDeepOutput = () => {
  let content = ``;

  content += getV3PackageImportsCode(CLIENTS_TO_TEST, { useV3ClientName: true });
  content += `\n`;
  content += getV3ClientsNewExpressionCode(
    CLIENTS_TO_TEST.map((clientName) => CLIENT_NAMES_MAP[clientName])
  );

  return content;
};
