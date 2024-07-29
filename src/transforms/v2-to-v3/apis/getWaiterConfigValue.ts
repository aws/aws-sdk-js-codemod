import type { ObjectExpression } from "jscodeshift";

export const getWaiterConfigValue = (waiterConfiguration: ObjectExpression, key: string) => {
  for (const property of waiterConfiguration.properties) {
    if (property.type !== "Property" && property.type !== "ObjectProperty") {
      continue;
    }
    if (property.key.type !== "Identifier") {
      continue;
    }
    if (property.key.name === key) {
      const propertyValue = property.value;
      if (propertyValue.type === "Literal" || propertyValue.type === "StringLiteral") {
        if (typeof propertyValue.value === "number") {
          return propertyValue.value.toString();
        }
        if (typeof propertyValue.value === "string") {
          return propertyValue.value;
        }
      }
      return;
    }
  }
};
