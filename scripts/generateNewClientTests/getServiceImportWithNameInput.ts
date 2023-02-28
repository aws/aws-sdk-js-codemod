import { CLIENTS_TO_TEST, LOCAL_NAME_SUFFIX } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getServiceImportWithNameInput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  content += `import { \n${CLIENTS_TO_TEST.map(
    (clientName) => `  ${clientName} as ${clientName}${LOCAL_NAME_SUFFIX}`
  ).join(`,\n`)}\n} from "aws-sdk";\n`;
  content += `\n`;
  content += getV2ClientsNewExpressionCode(
    CLIENTS_TO_TEST.map((clientName) => `${clientName}${LOCAL_NAME_SUFFIX}`)
  );

  return content;
};
