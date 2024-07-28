import type { ObjectExpression } from "jscodeshift";

export const getArgsWithoutWaiterConfig = (options: ObjectExpression): ObjectExpression => {
  options.properties = options.properties.filter((property) => {
    if (property.type !== "Property" && property.type !== "ObjectProperty") {
      return true;
    }
    const propertyKey = property.key;
    if (propertyKey.type !== "Identifier") {
      return true;
    }
    if (propertyKey.name === "$waiter") {
      return false;
    }
    return true;
  });

  return options;
};
