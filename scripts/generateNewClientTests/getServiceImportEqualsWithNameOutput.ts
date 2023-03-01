import { CLIENTS_TO_TEST } from "./config";
import { getClientNameWithLocalSuffix } from "./getClientNameWithLocalSuffix";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3PackageImportEqualsCode } from "./getV3PackageImportEqualsCode";

export const getServiceImportEqualsWithNameOutput = (codegenComment: string) => {
  let content = `${codegenComment};\n`;

  content += getV3PackageImportEqualsCode(CLIENTS_TO_TEST, { useLocalSuffix: true });
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST.map(getClientNameWithLocalSuffix));

  return content;
};
