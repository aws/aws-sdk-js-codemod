import { ObjectExpression, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";

export const getWaiterConfiguration = (callArgument: unknown): ObjectExpression | undefined => {
  if ((callArgument as ObjectExpression).type !== "ObjectExpression") {
    return;
  }
  for (const property of (callArgument as ObjectExpression).properties) {
    if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
      continue;
    }
    const propertyKey = (property as Property | ObjectProperty).key;
    const propertyValue = (property as Property | ObjectProperty).value;
    if (propertyKey.type !== "Identifier" || propertyValue.type !== "ObjectExpression") {
      continue;
    }
    if (propertyKey.name === "$waiter") {
      return propertyValue;
    }
  }
};
