import { CLIENTS_TO_TEST } from "./config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";
import { getV3ImportEqualsCode } from "./getV3ImportEqualsCode";

export const getServiceImportEqualsOutput = (codegenComment: string) => {
  let content = `${codegenComment};\n`;

  content += getV3ImportEqualsCode(CLIENTS_TO_TEST);
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};
