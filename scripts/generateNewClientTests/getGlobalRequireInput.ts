import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequireInput = (codegenComment: string) => {
  let globalRequireInputContent = `${codegenComment}\n`;

  globalRequireInputContent += `const AWS = require("aws-sdk");\n\n`;
  globalRequireInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST, `AWS.`);

  return globalRequireInputContent;
};
