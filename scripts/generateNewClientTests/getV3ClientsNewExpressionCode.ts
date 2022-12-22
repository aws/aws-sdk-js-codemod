import { CLIENT_NAMES, CLIENT_NAMES_MAP } from "../../src/transforms/v2-to-v3/utils/config";

export const getV3ClientsNewExpressionCode = () => {
  let v3ClientsNewExpressionCode = ``;
  for (const v2ClientName of CLIENT_NAMES) {
    v3ClientsNewExpressionCode += `new ${CLIENT_NAMES_MAP[v2ClientName]}();\n`;
  }
  return v3ClientsNewExpressionCode;
};
