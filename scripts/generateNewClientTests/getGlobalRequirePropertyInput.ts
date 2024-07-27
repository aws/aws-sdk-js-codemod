import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequirePropertyInput = () => {
  let content = "";

  for (const clientName of CLIENTS_TO_TEST) {
    content += `const ${clientName} = require("aws-sdk").${clientName};\n`;
  }
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
