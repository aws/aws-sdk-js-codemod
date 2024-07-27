import {
  type CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";

export interface V3PackageImportsCodeOptions {
  useLocalSuffix?: boolean;
}

export const getV3PackageImportsCode = (
  v2ClientNames: typeof CLIENT_NAMES,
  options?: V3PackageImportsCodeOptions
) => {
  let content = "";
  const { useLocalSuffix = false } = options || {};

  for (const v2ClientName of v2ClientNames) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v2ClientLocalName = useLocalSuffix
      ? getClientNameWithLocalSuffix(v2ClientName)
      : v2ClientName;

    const v3ImportSpecifier =
      v2ClientName === v2ClientLocalName ? v3ClientName : `${v3ClientName} as ${v2ClientLocalName}`;

    content += `import { ${v3ImportSpecifier} } from "${v3ClientPackageName}";\n`;
  }

  return content;
};
