import {
  CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/config";

export const getV3PackageRequiresCode = (clientsToTest: typeof CLIENT_NAMES) => {
  let content = ``;

  content += `const `;
  for (const v2ClientName of clientsToTest) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3RequireKeyValuePair =
      v3ClientName === v2ClientName ? v3ClientName : `${v3ClientName}: ${v2ClientName}`;
    content +=
      `{\n` +
      `        ${v3RequireKeyValuePair}\n` +
      `      } = require("${v3ClientPackageName}"),\n` +
      `      `;
  }
  content = content.replace(/,\n {6}$/, ";\n\n");

  return content;
};
