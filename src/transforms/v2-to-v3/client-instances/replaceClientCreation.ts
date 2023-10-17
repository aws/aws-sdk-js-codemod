import { Collection, JSCodeshift } from "jscodeshift";

import { ImportType } from "../modules";
import { getV3ClientTypeName } from "../ts-type";
import { getClientNewExpression } from "../utils";

export interface ReplaceClientCreationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
  importType: ImportType;
}

// Replace v2 client creation with v3 client creation.
export const replaceClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  {
    v2ClientName,
    v2ClientLocalName,
    v2GlobalName,
    v3ClientName,
    importType,
  }: ReplaceClientCreationOptions
): void => {
  const clientName =
    importType === ImportType.IMPORT_EQUALS || v2ClientName === v2ClientLocalName
      ? v3ClientName
      : v2ClientLocalName;
  const clientLocalName =
    importType === ImportType.IMPORT_EQUALS ? v2ClientName : v2ClientLocalName;
  const v3ClientConstructor = getV3ClientTypeName(clientName, clientLocalName, importType);

  if (v2GlobalName) {
    source
      .find(j.NewExpression, getClientNewExpression({ v2GlobalName, v2ClientName }))
      .replaceWith((v2ClientNewExpression) =>
        j.newExpression(j.identifier(v3ClientConstructor), v2ClientNewExpression.node.arguments)
      );
  }

  source
    .find(j.NewExpression, getClientNewExpression({ v2ClientName, v2ClientLocalName }))
    .replaceWith((v2ClientNewExpression) =>
      j.newExpression(j.identifier(v3ClientConstructor), v2ClientNewExpression.node.arguments)
    );
};
