import { CLIENTS_TO_TEST } from "./config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportWithNameInput = () => {
  let content = "";

  content += `import { \n${CLIENTS_TO_TEST.map(
    (clientName) => `  ${clientName} as ${getClientNameWithLocalSuffix(clientName)}`
  ).join(",\n")}\n} from "aws-sdk";\n`;
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
