import { Collection, JSCodeshift } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB, DYNAMODB_DOCUMENT, DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { ImportType, getImportEqualsLocalNameSuffix } from "../modules";
import { getV3ClientTypeName } from "../ts-type";
import { getClientNewExpression } from "../utils";
import { getDynamoDBDocClientArgs } from "./getDynamoDBDocClientArgs";

export interface ReplaceDocClientCreationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  importType: ImportType;
}

export const replaceDocClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName, importType }: ReplaceDocClientCreationOptions
): void => {
  if (v2ClientName !== DYNAMODB) return;

  const v3DocClientName = getV3ClientTypeName(
    DYNAMODB_DOCUMENT,
    getImportEqualsLocalNameSuffix(v2ClientName, "@aws-sdk/lib-dynamodb"),
    importType
  );
  const ddbDocClientOptions = { v2ClientName, v2ClientLocalName, importType };

  if (v2GlobalName) {
    source
      .find(
        j.NewExpression,
        getClientNewExpression({ v2GlobalName, v2ClientName: DYNAMODB_DOCUMENT_CLIENT })
      )
      .replaceWith((v2DocClientNewExpression) =>
        j.callExpression(
          j.memberExpression(j.identifier(v3DocClientName), j.identifier("from")),
          getDynamoDBDocClientArgs(j, v2DocClientNewExpression, ddbDocClientOptions)
        )
      );
  }

  source
    .find(
      j.NewExpression,
      getClientNewExpression({ v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}` })
    )
    .replaceWith((v2DocClientNewExpression) =>
      j.callExpression(
        j.memberExpression(j.identifier(v3DocClientName), j.identifier("from")),
        getDynamoDBDocClientArgs(j, v2DocClientNewExpression, ddbDocClientOptions)
      )
    );
};
