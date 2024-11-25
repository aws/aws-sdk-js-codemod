import { CLIENTS_TO_TEST } from "./config.ts";
import { getClientDeepImportPath } from "./getClientDeepImportPath.ts";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode.ts";

export const getServiceImportDeepInput = () => {
  let content = "";

  for (const clientName of CLIENTS_TO_TEST) {
    content += `import ${clientName} from "${getClientDeepImportPath(clientName)}";\n`;
  }
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
