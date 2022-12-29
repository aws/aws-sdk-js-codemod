import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireInput = (codegenComment: string) => {
  let serviceRequireInputContent = `${codegenComment}\n`;

  for (const clientName of CLIENT_NAMES) {
    serviceRequireInputContent += `const { ${clientName} } = require("aws-sdk");\n`;
  }
  serviceRequireInputContent += `\n`;
  serviceRequireInputContent += getV2ClientsNewExpressionCode();

  return serviceRequireInputContent;
};
