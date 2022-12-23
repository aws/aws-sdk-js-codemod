import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequireInputContent = (codegenComment: string) => {
  let globalRequireInputContent = `${codegenComment}\n`;

  globalRequireInputContent += `const AWS = require("aws-sdk");\n\n`;
  globalRequireInputContent += getV2ClientsNewExpressionCode(`AWS.`);

  return globalRequireInputContent;
};
