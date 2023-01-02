import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireInput = (codegenComment: string) => {
  let serviceRequireInputContent = `${codegenComment}\n`;

  for (const clientName of CLIENTS_TO_TEST) {
    serviceRequireInputContent += `const { ${clientName} } = require("aws-sdk");\n`;
  }
  serviceRequireInputContent += `\n`;
  serviceRequireInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return serviceRequireInputContent;
};
