import { API, FileInfo, Identifier } from "jscodeshift";

import {
  addV3ClientImport,
  getClientMetadata,
  getV2ClientNames,
  getV2DefaultImportName,
  removeDefaultImportIfNotUsed,
  replaceClientCreation,
} from "./utils";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const source = j(file.source);

  const v2DefaultImportName = getV2DefaultImportName(j, source);
  if (!v2DefaultImportName) {
    return source.toSource();
  }

  const v2ClientNames = getV2ClientNames(j, source, v2DefaultImportName);
  const clientMetadata = getClientMetadata(v2ClientNames);

  for (const [v2ClientName, v3ClientMetadata] of Object.entries(clientMetadata).reverse()) {
    const { v3ClientName, v3ClientPackageName } = v3ClientMetadata;
    addV3ClientImport(j, source, { v3ClientName, v3ClientPackageName });

    // ToDo: Move to utils file
    source
      .find(j.VariableDeclarator, {
        id: { type: "Identifier" },
        init: {
          type: "NewExpression",
          callee: {
            object: { type: "Identifier", name: v2DefaultImportName },
            property: { type: "Identifier", name: v2ClientName },
          },
        },
      })
      .forEach((nodePath) => {
        const name = (nodePath.value.id as Identifier).name;
        source
          .find(j.CallExpression, {
            callee: {
              object: {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: {
                    type: "Identifier",
                    name,
                  },
                },
              },
              property: { type: "Identifier", name: "promise" },
            },
          })
          .forEach((callExpressionPath) => {
            callExpressionPath.parentPath.value.object = (
              callExpressionPath.value.callee as any
            ).object;
          });
      });

    replaceClientCreation(j, source, {
      v2DefaultImportName,
      v2ClientName,
      v3ClientName,
    });
  }

  removeDefaultImportIfNotUsed(j, source, v2DefaultImportName);

  return source.toSource();
}
