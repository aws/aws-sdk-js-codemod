import { CLIENT_NAMES, CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { getDefaultLocalName } from "../../src/transforms/v2-to-v3/utils";

export const getV3PackageImportEqualsCode = (clientsToTest: typeof CLIENT_NAMES) => {
  let content = ``;

  for (const v2ClientName of clientsToTest) {
    const v3ClientDefaultLocalName = getDefaultLocalName(v2ClientName);
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    content += `import ${v3ClientDefaultLocalName} = require("${v3ClientPackageName}");\n`;
  }

  return content;
};
