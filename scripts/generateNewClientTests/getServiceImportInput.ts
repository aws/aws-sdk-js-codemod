import { CLIENTS_TO_TEST } from "./config.ts";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode.ts";

export const getServiceImportInput = (path?: string) => {
  let content = "";

  content += `import { ${CLIENTS_TO_TEST.join(", ")} } from "${path ? path : "aws-sdk"}";\n`;
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
