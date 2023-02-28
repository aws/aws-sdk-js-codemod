import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportDeepStarInput = (codegenComment: string) => {
  let serviceImportInputContent = `${codegenComment}\n`;

  for (const clientName of CLIENTS_TO_TEST) {
    serviceImportInputContent += `import * as ${clientName} from "aws-sdk/clients/${clientName.toLowerCase()}";\n`;
  }
  serviceImportInputContent += `\n`;
  serviceImportInputContent += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return serviceImportInputContent;
};
