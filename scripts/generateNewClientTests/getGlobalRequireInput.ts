import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequireInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += `const AWS = require("aws-sdk");\n\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST, `AWS.`);

  return content;
};
