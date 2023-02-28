import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportDeepStarInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  for (const clientName of CLIENTS_TO_TEST) {
    content += `import * as ${clientName} from "aws-sdk/clients/${clientName.toLowerCase()}";\n`;
  }
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
