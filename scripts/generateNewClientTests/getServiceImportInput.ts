import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportInput = () => {
  let content = ``;

  content += `import { ${CLIENTS_TO_TEST.join(", ")} } from "aws-sdk";\n`;
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
