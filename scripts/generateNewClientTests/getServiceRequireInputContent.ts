import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireInputContent = (codegenComment: string) => {
  let serviceImportInputContent = `${codegenComment}\n`;

  for (const clientName of CLIENT_NAMES) {
    serviceImportInputContent += `const ${clientName} = require("aws-sdk/clients/${clientName.toLowerCase()}");\n`;
  }
  serviceImportInputContent += `\n`;
  serviceImportInputContent += getV2ClientsNewExpressionCode();

  return serviceImportInputContent;
};
