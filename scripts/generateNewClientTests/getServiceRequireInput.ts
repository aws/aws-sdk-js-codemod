import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireInput = (codegenComment: string) => {
  let serviceRequireInputContent = `${codegenComment}\n`;

  serviceRequireInputContent += `const { ${CLIENTS_TO_TEST.join(", ")} } = require("aws-sdk");\n`;
  serviceRequireInputContent += `\n`;
  serviceRequireInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return serviceRequireInputContent;
};
