import type { Collection, JSCodeshift, ObjectExpression } from "jscodeshift";
import {
  getClientNewExpressionFromGlobalName,
  getClientNewExpressionFromLocalName,
} from "../utils/index.ts";
import { getNewClientExpression } from "./getNewClientExpression.ts";

export interface ReplaceClientCreationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
  awsGlobalConfig: ObjectExpression;
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
    awsGlobalConfig,
  }: ReplaceClientCreationOptions
): void => {
  const clientName = v2ClientName === v2ClientLocalName ? v3ClientName : v2ClientLocalName;

  source
    .find(j.NewExpression, getClientNewExpressionFromLocalName(v2ClientLocalName))
    .replaceWith((v2ClientNewExpression) =>
      getNewClientExpression(j, clientName, { v2ClientNewExpression, awsGlobalConfig })
    );

  if (v2GlobalName) {
    source
      .find(j.NewExpression, getClientNewExpressionFromGlobalName(v2GlobalName, v2ClientName))
      .replaceWith((v2ClientNewExpression) =>
        getNewClientExpression(j, clientName, { v2ClientNewExpression, awsGlobalConfig })
      );
  }
};
