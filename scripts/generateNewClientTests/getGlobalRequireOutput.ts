import { CLIENT_NAMES_MAP, CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";

export const getGlobalRequireOutput = (codegenComment: string) => {
  let globalRequireOutputContent = `${codegenComment}\n`;

  const sortedClientNames = getClientNamesSortedByPackageName();
  globalRequireOutputContent += `const `;
  for (const v2ClientName of sortedClientNames) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3RequireKeyValuePair =
      v3ClientName === v2ClientName ? v3ClientName : `${v3ClientName}: ${v2ClientName}`;
    globalRequireOutputContent +=
      `{\n` +
      `        ${v3RequireKeyValuePair}\n` +
      `      } = require("${v3ClientPackageName}"),\n` +
      `      `;
  }
  globalRequireOutputContent = globalRequireOutputContent.replace(/,\n {6}$/, ";\n\n");
  globalRequireOutputContent += getV3ClientsNewExpressionCode();

  return globalRequireOutputContent;
};
