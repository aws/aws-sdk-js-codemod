import { getV2ClientsNewExpressionCode } from "./getV2ClientsNewExpressionCode";
import { getV2ServiceImportsCode } from "./getV2ServiceImportsCode";

export const getServiceImportInputContent = (codegenComment: string) => {
  let serviceImportInputContent = `${codegenComment}\n`;

  serviceImportInputContent += getV2ServiceImportsCode();
  serviceImportInputContent += `\n`;
  serviceImportInputContent += getV2ClientsNewExpressionCode();

  return serviceImportInputContent;
};
