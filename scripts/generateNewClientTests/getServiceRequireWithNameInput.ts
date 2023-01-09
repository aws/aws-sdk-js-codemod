import { CLIENTS_TO_TEST, LOCAL_NAME_SUFFIX } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireWithNameInput = (codegenComment: string) => {
  let serviceRequireInputContent = `${codegenComment}\n`;

  serviceRequireInputContent += `const { \n${CLIENTS_TO_TEST.map(
    (clientName) => `  ${clientName}: ${clientName}${LOCAL_NAME_SUFFIX}`
  ).join(`,\n`)}\n } = require("aws-sdk");\n`;
  serviceRequireInputContent += `\n`;
  serviceRequireInputContent += getV2ClientsNewExpressionCode(
    CLIENTS_TO_TEST.map((clientName) => `${clientName}${LOCAL_NAME_SUFFIX}`)
  );

  return serviceRequireInputContent;
};
