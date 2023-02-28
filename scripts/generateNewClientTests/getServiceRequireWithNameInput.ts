import { CLIENTS_TO_TEST, LOCAL_NAME_SUFFIX } from "./config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireWithNameInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += `const { \n${CLIENTS_TO_TEST.map(
    (clientName) => `  ${clientName}: ${clientName}${LOCAL_NAME_SUFFIX}`
  ).join(`,\n`)}\n} = require("aws-sdk");\n`;
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
