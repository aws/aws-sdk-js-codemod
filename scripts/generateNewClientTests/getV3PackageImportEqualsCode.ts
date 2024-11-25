import {
  type CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/config/index.ts";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix/index.ts";

export interface V3PackageImportEqualsCodeOptions {
  useLocalSuffix?: boolean;
}

export const getV3PackageImportEqualsCode = (
  clientsToTest: typeof CLIENT_NAMES,
  options?: V3PackageImportEqualsCodeOptions
) => {
  let content = "";
  const { useLocalSuffix = false } = options || {};

  for (const v2ClientName of clientsToTest) {
    const v3ClientDefaultLocalName = [
      "AWS",
      ...CLIENT_PACKAGE_NAMES_MAP[v2ClientName].split("-"),
    ].join("_");
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    content += `import ${v3ClientDefaultLocalName} = require("${v3ClientPackageName}");\n`;

    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const importName = useLocalSuffix ? getClientNameWithLocalSuffix(v2ClientName) : v3ClientName;
    content += `import ${importName} = ${[v3ClientDefaultLocalName, v3ClientName].join(".")};\n`;
  }

  return content;
};
