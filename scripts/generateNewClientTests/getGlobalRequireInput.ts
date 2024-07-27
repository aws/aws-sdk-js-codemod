import { CLIENTS_TO_TEST } from "./config";
import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";

export const getGlobalRequireInput = () => {
  let content = "";

  content += `const AWS = require("aws-sdk");\n\n`;
  content += getV2ClientsNewExpressionCode(CLIENTS_TO_TEST, `AWS.`);

  return content;
};
