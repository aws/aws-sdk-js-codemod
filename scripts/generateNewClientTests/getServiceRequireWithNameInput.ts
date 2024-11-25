import { CLIENTS_TO_TEST } from "./config.ts";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix.ts";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode.ts";

export const getServiceRequireWithNameInput = () => {
  let content = "";

  content += `const { \n${CLIENTS_TO_TEST.map(
    (clientName) => `  ${clientName}: ${getClientNameWithLocalSuffix(clientName)}`
  ).join(",\n")}\n} = require("aws-sdk");\n`;
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
