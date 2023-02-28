import { CLIENTS_TO_TEST } from "./config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageRequiresCode } from "./getV3PackageRequiresCode";

export const getServiceRequireDeepOutput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += getV3PackageRequiresCode(CLIENTS_TO_TEST, { declarationPerClient: true });
  content += `\n`;
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
