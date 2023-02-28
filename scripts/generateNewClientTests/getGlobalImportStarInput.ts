import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalImportStarInput = (codegenComment: string) => {
  let globalImportInputContent = `${codegenComment}\n`;

  globalImportInputContent += `import * as AWS from "aws-sdk";\n\n`;
  globalImportInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST, `AWS.`);

  return globalImportInputContent;
};
