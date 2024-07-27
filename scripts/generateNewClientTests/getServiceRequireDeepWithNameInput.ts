import { CLIENTS_TO_TEST } from "./config";
import { getClientDeepImportPath } from "./getClientDeepImportPath";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceRequireDeepWithNameInput = () => {
  let content = "";

  for (const clientName of CLIENTS_TO_TEST) {
    const importedName = getClientNameWithLocalSuffix(clientName);
    content += `const ${importedName} = require("${getClientDeepImportPath(clientName)}");\n`;
  }
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
