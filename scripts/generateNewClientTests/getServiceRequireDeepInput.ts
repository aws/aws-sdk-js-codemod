import { CLIENTS_TO_TEST } from "./config/index.ts";
import { getClientDeepImportPath } from "./getClientDeepImportPath/index.ts";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode/index.ts";

export const getServiceRequireDeepInput = () => {
  let content = "";

  for (const clientName of CLIENTS_TO_TEST) {
    content += `const ${clientName} = require("${getClientDeepImportPath(clientName)}");\n`;
  }
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
