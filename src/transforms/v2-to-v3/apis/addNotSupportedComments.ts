import { Collection, JSCodeshift } from "jscodeshift";
import { getClientNamesFromDeepImport } from "../client-names";
import { DOCUMENT_CLIENT, DYNAMODB } from "../config";
import { hasRequire } from "../modules";
import { getClientDeepImportPath } from "../utils";

export const addNotSupportedComments = (j: JSCodeshift, source: Collection<unknown>) => {
  const clientNamesFromDeepImport = getClientNamesFromDeepImport(source.toSource());

  if (clientNamesFromDeepImport.includes(DYNAMODB)) {
    const deepImportPath = getClientDeepImportPath(DYNAMODB);

    const documentClientDeepNamedImportUnsupportedComments = [
      j.commentLine(
        " Transformation of DocumentClient named import from deep path is unsupported in aws-sdk-js-codemod."
      ),
      j.commentLine(" Please convert to a default import, and re-run aws-sdk-js-codemod."),
    ];

    if (hasRequire(j, source)) {
      // const idsFromNamedImport = getRequireIds(j, source, deepImportPath).filter(
      //   (id) => id.type === "ObjectPattern"
      // );
      // ToDo: Add comments.
    } else {
      source
        .find(j.ImportDeclaration, {
          type: "ImportDeclaration",
          source: { value: deepImportPath },
        })
        .filter((importDeclaration) => {
          return (importDeclaration.value.specifiers || []).some(
            (importDeclaration) =>
              importDeclaration.type === "ImportSpecifier" &&
              importDeclaration.imported.name === DOCUMENT_CLIENT
          );
        })
        .forEach((importDeclaration) => {
          const comments = importDeclaration.value.comments || [];
          importDeclaration.value.comments = [
            ...comments,
            ...documentClientDeepNamedImportUnsupportedComments,
          ];
        });
    }
  }
};
