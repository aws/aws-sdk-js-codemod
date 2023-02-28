import { CLIENTS_TO_TEST, LOCAL_NAME_SUFFIX } from "./config";
import { getClientDeepImportPath } from "./getClientDeepImportPath";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportDeepStarWithNameInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  for (const clientName of CLIENTS_TO_TEST) {
    content += `import * as ${clientName}${LOCAL_NAME_SUFFIX} from "${getClientDeepImportPath(
      clientName
    )}";\n`;
  }
  content += `\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
