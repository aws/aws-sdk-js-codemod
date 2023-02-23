import { CLIENT_NAMES_MAP, CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { getV3DefaultLocalName } from "../../src/transforms/v2-to-v3/utils";
import { CLIENTS_TO_TEST } from "./config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";

export const getGlobalImportEqualsOutput = (codegenComment: string) => {
  let globalImportEqualsOutputContent = `${codegenComment};\n`;

  const sortedClientNames = getClientNamesSortedByPackageName(CLIENTS_TO_TEST);

  for (const v2ClientName of sortedClientNames) {
    const v3ClientDefaultLocalName = getV3DefaultLocalName(v2ClientName);
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    globalImportEqualsOutputContent += `import ${v3ClientDefaultLocalName} = require("${v3ClientPackageName}");\n\n`;

    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ObjectPattern =
      v3ClientName === v2ClientName ? v3ClientName : `${v3ClientName}: ${v2ClientName}`;
    globalImportEqualsOutputContent +=
      `const {\n` + `  ${v3ObjectPattern}\n` + `} = ${getV3DefaultLocalName(v2ClientName)};\n\n`;
  }

  globalImportEqualsOutputContent += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return globalImportEqualsOutputContent;
};
