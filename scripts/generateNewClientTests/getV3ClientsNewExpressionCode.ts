import { CLIENT_NAMES } from "../../src/transforms/v2-to-v3/config";

export const getV3ClientsNewExpressionCode = () => {
  let v3ClientsNewExpressionCode = ``;
  for (const v2ClientName of CLIENT_NAMES) {
    v3ClientsNewExpressionCode += `new ${v2ClientName}();\n`;
  }
  return v3ClientsNewExpressionCode;
};
