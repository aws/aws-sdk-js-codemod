import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequireInputContent = (codegenComment: string) => {
  let globalImportInputContent = `${codegenComment}\n`;

  globalImportInputContent += `const AWS = require("aws-sdk");\n\n`;
  globalImportInputContent += getV2ClientsNewExpressionCode(`AWS.`);

  return globalImportInputContent;
};
