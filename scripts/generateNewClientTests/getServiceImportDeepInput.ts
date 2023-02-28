import { CLIENTS_TO_TEST } from "./config";
import { getClientDeepImportPath } from "./getClientDeepImportPath";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportDeepInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  for (const clientName of CLIENTS_TO_TEST) {
    content += `import ${clientName} from "${getClientDeepImportPath(clientName)}";\n`;
  }
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
