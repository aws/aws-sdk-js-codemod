import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += `import { ${CLIENTS_TO_TEST.join(", ")} } from "aws-sdk";\n`;
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
