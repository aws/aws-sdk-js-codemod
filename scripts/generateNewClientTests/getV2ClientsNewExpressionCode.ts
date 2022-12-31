import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config";

export const getV2ClientsNewExpressionCode = (prefix?: string) => {
  let v2ClientsNewExpressionCode = ``;
  for (const clientName of CLIENT_NAMES) {
    v2ClientsNewExpressionCode += `new ${prefix || ""}${clientName}();\n`;
  }
  return v2ClientsNewExpressionCode;
};
