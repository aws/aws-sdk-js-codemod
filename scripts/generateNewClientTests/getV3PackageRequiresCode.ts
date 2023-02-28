import {
  CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";

export interface V3PackageRequiresCodeOptions {
  useLocalSuffix?: boolean;
  declarationPerClient?: boolean;
}

export const getV3PackageRequiresCode = (
  clientsToTest: typeof CLIENT_NAMES,
  options?: V3PackageRequiresCodeOptions
) => {
  let content = ``;
  const { useLocalSuffix = false, declarationPerClient = false } = options || {};

  if (!declarationPerClient) {
    content += `const `;
  }

  for (const v2ClientName of clientsToTest) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v2ClientLocalName = useLocalSuffix
      ? getClientNameWithLocalSuffix(v2ClientName)
      : v2ClientName;

    const v3RequireKeyValuePair =
      v3ClientName === v2ClientLocalName ? v3ClientName : `${v3ClientName}: ${v2ClientLocalName}`;
    content += declarationPerClient
      ? `const {\n  ${v3RequireKeyValuePair}\n} = require("${v3ClientPackageName}");\n`
      : `{\n        ${v3RequireKeyValuePair}\n      } = require("${v3ClientPackageName}"),\n      `;
  }

  if (!declarationPerClient) {
    content = content.replace(/,\n {6}$/, ";\n\n");
  }

  return content;
};
