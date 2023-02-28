import {
  CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/config";
import { getV3DefaultLocalName } from "../../src/transforms/v2-to-v3/utils";

export const getV3PackageImportEqualsCode = (clientsToTest: typeof CLIENT_NAMES) => {
  let content = ``;

  for (const v2ClientName of clientsToTest) {
    const v3ClientDefaultLocalName = getV3DefaultLocalName(v2ClientName);
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    content += `import ${v3ClientDefaultLocalName} = require("${v3ClientPackageName}");\n\n`;

    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ObjectPattern =
      v3ClientName === v2ClientName ? v3ClientName : `${v3ClientName}: ${v2ClientName}`;
    content +=
      `const {\n` + `  ${v3ObjectPattern}\n` + `} = ${getV3DefaultLocalName(v2ClientName)};\n\n`;
  }

  return content;
};
