import {
  CLIENT_NAMES_MAP,
  CLIENT_PACKAGE_NAMES_MAP,
} from "../../src/transforms/v2-to-v3/utils/config";
import { getClientNamesSortedByPackageName } from "./getClientNamesSortedByPackageName";

export const getV3PackageImportsCode = () => {
  let v3PackageImportsCode = ``;
  for (const v2ClientName of getClientNamesSortedByPackageName()) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    v3PackageImportsCode += `import { ${v3ClientName} } from "${v3ClientPackageName}";\n`;
  }
  return v3PackageImportsCode;
};
