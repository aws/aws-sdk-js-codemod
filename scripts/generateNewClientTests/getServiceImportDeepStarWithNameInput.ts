import { CLIENTS_TO_TEST } from "./config.ts";
import { getClientDeepImportPath } from "./getClientDeepImportPath.ts";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix.ts";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode.ts";

export const getServiceImportDeepStarWithNameInput = () => {
  let content = "";

  for (const clientName of CLIENTS_TO_TEST) {
    const importName = getClientNameWithLocalSuffix(clientName);
    content += `import * as ${importName} from "${getClientDeepImportPath(clientName)}";\n`;
  }
  content += "\n";
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
