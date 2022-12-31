import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportInput = (codegenComment: string) => {
  let serviceImportInputContent = `${codegenComment}\n`;

  for (const clientName of CLIENT_NAMES) {
    serviceImportInputContent += `import { ${clientName} } from "aws-sdk";\n`;
  }
  serviceImportInputContent += `\n`;
  serviceImportInputContent += getV2ClientsNewExpressionCode();

  return serviceImportInputContent;
};
