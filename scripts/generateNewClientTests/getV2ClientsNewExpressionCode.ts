import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/utils/config";

export const getV2ClientsNewExpressionCode = () => {
  let v2ClientsNewExpressionCode = ``;
  for (const clientName of CLIENT_NAMES) {
    v2ClientsNewExpressionCode += `new AWS.${clientName}();\n`;
  }
  return v2ClientsNewExpressionCode;
};
