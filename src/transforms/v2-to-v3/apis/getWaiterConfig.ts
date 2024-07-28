import type { ObjectExpression } from "jscodeshift";

export const getWaiterConfig = (originalConfig: ObjectExpression): ObjectExpression | undefined => {
  for (const property of originalConfig.properties) {
    if (property.type !== "Property" && property.type !== "ObjectProperty") {
      continue;
    }
    if (property.key.type !== "Identifier" || property.value.type !== "ObjectExpression") {
      continue;
    }
    if (property.key.name === "$waiter") {
      return property.value;
    }
  }
};
