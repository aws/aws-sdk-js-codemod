import { ASTPath, JSCodeshift, NewExpression, ObjectProperty, Property } from "jscodeshift";

import { DYNAMODB, OBJECT_PROPERTY_TYPE_LIST } from "../config";

export interface GetDynamoDBForDocClientOptions {
  v2ClientLocalName?: string;
}

export const getDynamoDBForDocClient = (
  j: JSCodeshift,
  v2DocClientNewExpression: ASTPath<NewExpression>,
  { v2ClientLocalName }: GetDynamoDBForDocClientOptions
) => {
  const v2DocClientArgs = v2DocClientNewExpression.node.arguments || [];

  // Return value in `service` param if it's provided.
  if (v2DocClientArgs.length > 0) {
    const params = v2DocClientArgs[0];
    if (params.type === "ObjectExpression") {
      const serviceProperty = params.properties.find((property) => {
        if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
          return false;
        }
        const propertyKey = (property as Property | ObjectProperty).key;
        if (propertyKey.type !== "Identifier") {
          return false;
        }
        if (propertyKey.name === "service") {
          return true;
        }
      }) as Property | ObjectProperty | undefined;

      if (serviceProperty) {
        // The value here will work in most Document Client creations.
        // Adding typecast to skip TypeScript errors.
        return serviceProperty.value as NewExpression;
      }
    }
  }

  const v3DocClientArgs = v2DocClientArgs[0];
  const v3DocClientNewExpressionArgs = [];

  // Remove DocumentClient option convertEmptyValues.
  if (v3DocClientArgs.type === "ObjectExpression") {
    v3DocClientArgs.properties = v3DocClientArgs.properties.filter((property) => {
      if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
        return false;
      }
      const propertyKey = (property as Property | ObjectProperty).key;
      if (propertyKey.type !== "Identifier") {
        return false;
      }
      if (propertyKey.name === "convertEmptyValues") {
        return false;
      }
    });

    if (v3DocClientArgs.properties.length !== 0) {
      v3DocClientNewExpressionArgs.push(v3DocClientArgs);
    }
  } else {
    v3DocClientNewExpressionArgs.push(v3DocClientArgs);
  }

  return j.newExpression(
    v2ClientLocalName ? j.identifier(v2ClientLocalName) : j.identifier(DYNAMODB),
    v3DocClientNewExpressionArgs
  );
};
