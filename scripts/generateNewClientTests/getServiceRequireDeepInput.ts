import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireDeepInput = (codegenComment: string) => {
  let serviceRequireInputContent = `${codegenComment}\n`;

  for (const clientName of CLIENT_NAMES) {
    serviceRequireInputContent += `const ${clientName} = require("aws-sdk/clients/${clientName.toLowerCase()}");\n`;
  }
  serviceRequireInputContent += `\n`;
  serviceRequireInputContent += getV2ClientsNewExpressionCode();

  return serviceRequireInputContent;
};
