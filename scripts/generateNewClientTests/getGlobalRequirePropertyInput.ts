import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequirePropertyInput = (codegenComment: string) => {
  let globalRequireInputContent = `${codegenComment}\n`;

  for (const clientName of CLIENTS_TO_TEST) {
    globalRequireInputContent += `const ${clientName} = require("aws-sdk").${clientName};\n`;
  }
  globalRequireInputContent += `\n`;
  globalRequireInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return globalRequireInputContent;
};
