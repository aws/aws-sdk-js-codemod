import type { ASTPath, JSCodeshift, NewExpression } from "jscodeshift";

import { DYNAMODB } from "../config/index.ts";

export const getDynamoDBForDocClient = (
  j: JSCodeshift,
  v2DocClientNewExpression: ASTPath<NewExpression>,
  v2ClientLocalName?: string
) => {
  const v2DocClientArgs = v2DocClientNewExpression.node.arguments || [];

  // Return value in `service` param if it's provided.
  if (v2DocClientArgs.length > 0) {
    const params = v2DocClientArgs[0];
    if (params.type === "ObjectExpression") {
      for (const property of params.properties) {
        if (property.type !== "Property" && property.type !== "ObjectProperty") {
          continue;
        }

        const propertyKey = property.key;
        if (propertyKey.type !== "Identifier") {
          continue;
        }

        if (propertyKey.name === "service") {
          // The value here will work in most Document Client creations.
          // Adding typecast to skip TypeScript errors.
          return property.value as NewExpression;
        }
      }
    }
  }

  const v3DocClientArgs = v2DocClientArgs[0];
  const v3DocClientNewExpressionArgs = [];

  // Remove DocumentClient option convertEmptyValues and wrapNumbers.
  if (v3DocClientArgs) {
    if (v3DocClientArgs.type === "ObjectExpression") {
      v3DocClientArgs.properties = v3DocClientArgs.properties.filter((property) => {
        if (property.type !== "Property" && property.type !== "ObjectProperty") {
          return true;
        }
        if (property.key.type !== "Identifier") {
          return true;
        }
        return !["convertEmptyValues", "wrapNumbers"].includes(property.key.name);
      });

      if (v3DocClientArgs.properties.length > 0) {
        v3DocClientNewExpressionArgs.push(v3DocClientArgs);
      }
    } else {
      v3DocClientNewExpressionArgs.push(v3DocClientArgs);
    }
  }

  return j.newExpression(j.identifier(v2ClientLocalName ?? DYNAMODB), v3DocClientNewExpressionArgs);
};
