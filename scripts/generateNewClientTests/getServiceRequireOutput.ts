import {
  CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";

export const getServiceRequireOutput = (codegenComment: string) => {
  let serviceRequireOutputContent = `${codegenComment}\n`;

  for (const v2ClientName of CLIENT_NAMES) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3RequireKeyValuePair =
      v3ClientName === v2ClientName ? v3ClientName : `${v3ClientName}: ${v2ClientName}`;
    serviceRequireOutputContent += `const {\n  ${v3RequireKeyValuePair}\n} = require("${v3ClientPackageName}");\n`;
  }
  serviceRequireOutputContent += `\n`;
  serviceRequireOutputContent += getV3ClientsNewExpressionCode();

  return serviceRequireOutputContent;
};
