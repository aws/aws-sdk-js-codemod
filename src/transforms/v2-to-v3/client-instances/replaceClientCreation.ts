import { Collection, JSCodeshift } from "jscodeshift";
import { getClientNewExpression } from "../utils";
import { getNewClientExpression } from "./getNewClientExpression";

export interface ReplaceClientCreationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
  v3ClientName: string;
}

// Replace v2 client creation with v3 client creation.
export const replaceClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName, v3ClientName }: ReplaceClientCreationOptions
): void => {
  const clientName = v2ClientName === v2ClientLocalName ? v3ClientName : v2ClientLocalName;

  if (v2GlobalName) {
    source
      .find(j.NewExpression, getClientNewExpression({ v2GlobalName, v2ClientName }))
      .replaceWith((v2ClientNewExpression) =>
        getNewClientExpression(j, clientName, v2ClientNewExpression)
      );
  }

  source
    .find(j.NewExpression, getClientNewExpression({ v2ClientName, v2ClientLocalName }))
    .replaceWith((v2ClientNewExpression) =>
      getNewClientExpression(j, clientName, v2ClientNewExpression)
    );
};
