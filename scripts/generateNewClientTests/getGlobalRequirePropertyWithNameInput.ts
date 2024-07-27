import { CLIENTS_TO_TEST } from "./config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequirePropertyWithNameInput = () => {
  let content = "";

  for (const clientName of CLIENTS_TO_TEST) {
    const importName = getClientNameWithLocalSuffix(clientName);
    content += `const ${importName} = require("aws-sdk").${clientName};\n`;
  }
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
