import type { ObjectExpression, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";

export const getWaiterConfig = (originalConfig: ObjectExpression): ObjectExpression | undefined => {
  for (const property of originalConfig.properties) {
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
