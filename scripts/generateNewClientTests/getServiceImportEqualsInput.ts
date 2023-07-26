import { CLIENTS_TO_TEST } from "./config";
import { getClientDeepImportPath } from "./getClientDeepImportPath";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportEqualsInput = () => {
  let content = ``;

  for (const clientName of CLIENTS_TO_TEST) {
    content += `import ${clientName} = require("${getClientDeepImportPath(clientName)}");\n`;
  }
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
