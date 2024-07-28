import type { ObjectExpression, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";

export const getArgsWithoutWaiterConfig = (options: ObjectExpression): ObjectExpression => {
  options.properties = options.properties.filter((property) => {
    if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
      return true;
    }
    const propertyKey = (property as Property | ObjectProperty).key;
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
