import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalImportStarInput = () => {
  let content = "";

  content += `import * as AWS from "aws-sdk";\n\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST, "AWS.");

  return content;
};
