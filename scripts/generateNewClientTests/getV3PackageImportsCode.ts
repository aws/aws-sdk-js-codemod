import {
  CLIENT_NAMES,
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/utils/config";

export const getV3PackageImportsCode = (sortedV2ClientNames: typeof CLIENT_NAMES) => {
  let v3PackageImportsCode = ``;
  for (const v2ClientName of sortedV2ClientNames) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    v3PackageImportsCode += `import { ${v3ClientName} } from "${v3ClientPackageName}";\n`;
  }
  return v3PackageImportsCode;
};
