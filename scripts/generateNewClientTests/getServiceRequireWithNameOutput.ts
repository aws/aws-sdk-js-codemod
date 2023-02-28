import { CLIENT_NAMES_MAP, CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { CLIENTS_TO_TEST, LOCAL_NAME_SUFFIX } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";

export const getServiceRequireWithNameOutput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  const sortedClientNames = getClientNamesSortedByPackageName(CLIENTS_TO_TEST);
  content += `const `;
  for (const v2ClientName of sortedClientNames) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3ClientLocalName = `${v2ClientName}${LOCAL_NAME_SUFFIX}`;
    const v3RequireKeyValuePair =
      v3ClientName === v3ClientLocalName ? v3ClientName : `${v3ClientName}: ${v3ClientLocalName}`;
    content +=
      `{\n` +
      `        ${v3RequireKeyValuePair}\n` +
      `      } = require("${v3ClientPackageName}"),\n` +
      `      `;
  }
  content = content.replace(/,\n {6}$/, ";\n\n");
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
