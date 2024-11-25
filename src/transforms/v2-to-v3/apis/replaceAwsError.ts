import type { Collection, JSCodeshift } from "jscodeshift";
import { addNamedModule, type ImportType } from "../modules/index.ts";

export interface ReplaceAwsErrorOptions {
  v2GlobalName?: string;
  importType: ImportType;
}

export const replaceAwsError = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, importType }: ReplaceAwsErrorOptions
) => {
  const v2AwsErrorName = "AWSError";
  const v3AwsErrorName = "ServiceException";

  const namedModuleParams = {
    importType,
    localName: v3AwsErrorName,
    packageName: "@smithy/smithy-client",
  };

  if (v2GlobalName) {
    source
      .find(j.TSTypeReference, {
        typeName: {
          left: { type: "Identifier", name: v2GlobalName },
          right: { type: "Identifier", name: v2AwsErrorName },
        },
      })
      .replaceWith((v2ErrorType) => {
        addNamedModule(j, source, namedModuleParams);
        return j.tsTypeReference(j.identifier(v3AwsErrorName), v2ErrorType.node.typeParameters);
      });
  }

  source
    .find(j.TSTypeReference, {
      typeName: {
        type: "Identifier",
        name: v2AwsErrorName,
      },
    })
    .replaceWith((v2ErrorType) => {
      addNamedModule(j, source, namedModuleParams);
      return j.tsTypeReference(j.identifier(v3AwsErrorName), v2ErrorType.node.typeParameters);
    });
};
