import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportInput = (codegenComment: string) => {
  let serviceImportInputContent = `${codegenComment}\n`;

  serviceImportInputContent += `import { ${CLIENTS_TO_TEST.join(", ")} } from "aws-sdk";\n`;
  serviceImportInputContent += `\n`;
  serviceImportInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return serviceImportInputContent;
};
