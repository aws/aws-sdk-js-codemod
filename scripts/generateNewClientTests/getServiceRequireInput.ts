import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += `const { ${CLIENTS_TO_TEST.join(", ")} } = require("aws-sdk");\n`;
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
