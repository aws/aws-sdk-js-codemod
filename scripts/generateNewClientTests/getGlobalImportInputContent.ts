import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalImportInputContent = (codegenComment: string) => {
  let globalImportInputContent = `${codegenComment}\n`;
  globalImportInputContent += `import AWS from "aws-sdk";\n\n`;
  globalImportInputContent += getV2ClientsNewExpressionCode();
  return globalImportInputContent;
};
