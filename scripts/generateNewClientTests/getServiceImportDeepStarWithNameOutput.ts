import { CLIENT_NAMES_MAP, CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { CLIENTS_TO_TEST, LOCAL_NAME_SUFFIX } from "./config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";

export const getServiceImportDeepStarWithNameOutput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  for (const v2ClientName of CLIENTS_TO_TEST) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3ClientLocalName = `${v2ClientName}${LOCAL_NAME_SUFFIX}`;
    const v3ImportSpecifier =
      v3ClientName === v3ClientLocalName ? v3ClientName : `${v3ClientName} as ${v3ClientLocalName}`;
    content += `import { ${v3ImportSpecifier} } from "${v3ClientPackageName}";\n`;
  }
  content += `\n`;
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
