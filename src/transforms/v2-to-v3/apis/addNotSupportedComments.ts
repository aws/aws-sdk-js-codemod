import { Collection, JSCodeshift } from "jscodeshift";
import { getClientNamesFromDeepImport } from "../client-names";
import { DYNAMODB } from "../config";
import { getNodesWithDocClientNamedImportFromDeepPath } from "./getNodesWithDocClientNamedImportFromDeepPath";

export const addNotSupportedComments = (j: JSCodeshift, source: Collection<unknown>) => {
  const clientNamesFromDeepImport = getClientNamesFromDeepImport(source.toSource());

  if (clientNamesFromDeepImport.includes(DYNAMODB)) {
    const documentClientDeepNamedImportUnsupportedComments = [
      j.commentLine(
        " Transformation of DocumentClient named import from deep path is unsupported in aws-sdk-js-codemod."
      ),
      j.commentLine(" Please convert to a default import, and re-run aws-sdk-js-codemod."),
    ];

    getNodesWithDocClientNamedImportFromDeepPath(j, source).forEach((node) => {
      const comments = node.value.comments || [];
      node.value.comments = [...comments, ...documentClientDeepNamedImportUnsupportedComments];
    });
  }
};
