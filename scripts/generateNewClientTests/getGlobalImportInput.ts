import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalImportInput = (codegenComment: string) => {
  let globalImportInputContent = `${codegenComment}\n`;

  globalImportInputContent += `import AWS from "aws-sdk";\n\n`;
  globalImportInputContent += getV2ClientsNewExpressionCode(CLIENT_NAMES, `AWS.`);

  return globalImportInputContent;
};
