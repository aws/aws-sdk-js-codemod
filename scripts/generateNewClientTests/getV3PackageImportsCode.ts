import { CLIENT_NAMES_MAP, CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";

export const getV3PackageImportsCode = (clientNamesMap: [string, string][]) => {
  let content = ``;

  for (const [v2ClientName, v2ClientLocalName] of clientNamesMap) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3ImportSpecifier =
      v3ClientName === v2ClientLocalName ? v3ClientName : `${v3ClientName} as ${v2ClientLocalName}`;
    content += `import { ${v3ImportSpecifier} } from "${v3ClientPackageName}";\n`;
  }

  return content;
};
