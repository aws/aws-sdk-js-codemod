import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalImportEqualsInput = (codegenComment: string) => {
  let globalImportEqualsInputContent = `${codegenComment}\n`;

  globalImportEqualsInputContent += `import AWS = require("aws-sdk");\n\n`;
  globalImportEqualsInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST, `AWS.`);

  return globalImportEqualsInputContent;
};
