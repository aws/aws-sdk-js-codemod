import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config/index.ts";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode/index.ts";

export const getGlobalImportInput = () => {
  let content = "";

  content += `import AWS from "aws-sdk";\n\n`;
  content += getV2ClientsNewExpressionCode(CLIENT_NAMES, "AWS.");

  return content;
};
