import { Collection, JSCodeshift } from "jscodeshift";
import { getNewExpressionVariants } from "../apis";
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

  getNewExpressionVariants(getClientNewExpression({ v2ClientName, v2ClientLocalName })).forEach(
    (newExpressionVariant) => {
      source
        .find(j.NewExpression, newExpressionVariant)
        .replaceWith((v2ClientNewExpression) =>
          getNewClientExpression(j, clientName, v2ClientNewExpression)
        );
    }
  );

  if (v2GlobalName) {
    getNewExpressionVariants(getClientNewExpression({ v2GlobalName, v2ClientName })).forEach(
      (newExpressionVariant) => {
        source
          .find(j.NewExpression, newExpressionVariant)
          .replaceWith((v2ClientNewExpression) =>
            getNewClientExpression(j, clientName, v2ClientNewExpression)
          );
      }
    );
  }
};
