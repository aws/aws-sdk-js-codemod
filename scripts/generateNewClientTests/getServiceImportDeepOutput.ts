import { CLIENTS_TO_TEST } from "./config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportsCode } from "./getV3PackageImportsCode";

export const getServiceImportDeepOutput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += getV3PackageImportsCode(CLIENTS_TO_TEST);
  content += `\n`;
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
