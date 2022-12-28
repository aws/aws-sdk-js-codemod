import {
  CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/utils/config";

export const getV3PackageRequireCode = (
  sortedV2ClientNames: typeof CLIENT_NAMES,
  { extraNewLine = false }: { extraNewLine?: boolean } = {}
) => {
  let v3PackageRequireCode = ``;
  for (const v2ClientName of sortedV2ClientNames) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3RequireKeyValuePair =
      v3ClientName === v2ClientName ? v3ClientName : `${v3ClientName}: ${v2ClientName}`;
    v3PackageRequireCode += `const {\n  ${v3RequireKeyValuePair}\n} = require("${v3ClientPackageName}");\n`;
    if (extraNewLine) v3PackageRequireCode += `\n`;
  }
  return v3PackageRequireCode;
};
