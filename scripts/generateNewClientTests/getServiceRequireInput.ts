import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireInput = (path?: string) => {
  let content = "";

  content += `const { ${CLIENTS_TO_TEST.join(", ")} } = require("${path ? path : "aws-sdk"}");\n`;
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
