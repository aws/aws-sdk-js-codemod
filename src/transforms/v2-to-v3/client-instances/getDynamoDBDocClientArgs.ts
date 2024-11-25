import type { ASTPath, JSCodeshift, NewExpression } from "jscodeshift";
import { getDynamoDBForDocClient } from "./getDynamoDBForDocClient.ts";

export const getDynamoDBDocClientArgs = (
  j: JSCodeshift,
  v2DocClientNewExpression: ASTPath<NewExpression>,
  v2ClientLocalName?: string
) => {
  const dynamoDBDocClientOptions = j.objectExpression([]);

  const v2DocClientArgs = v2DocClientNewExpression.node.arguments || [];

  // Add DocumentClient option convertEmptyValues/wrapNumbers.
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

        const docClientOptionsHash: Record<string, string> = {
          convertEmptyValues: "marshallOptions",
          wrapNumbers: "unmarshallOptions",
        };

        if (Object.keys(docClientOptionsHash).includes(propertyKey.name)) {
          dynamoDBDocClientOptions.properties.push(
            j.property(
              "init",
              j.identifier(docClientOptionsHash[propertyKey.name]),
              j.objectExpression([
                j.property("init", j.identifier(propertyKey.name), property.value),
              ])
            )
          );
        }
      }
    }
  }

  return [
    getDynamoDBForDocClient(j, v2DocClientNewExpression, v2ClientLocalName),
    ...(dynamoDBDocClientOptions.properties.length > 0 ? [dynamoDBDocClientOptions] : []),
  ];
};
