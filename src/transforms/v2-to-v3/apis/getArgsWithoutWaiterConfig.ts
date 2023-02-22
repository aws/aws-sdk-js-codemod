import { ObjectExpression, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";

export const getArgsWithoutWaiterConfig = <T>(callArgument: T): T => {
  if ((callArgument as ObjectExpression).type !== "ObjectExpression") {
    return callArgument;
  }

  const objectExpression = callArgument as ObjectExpression;
  objectExpression.properties = objectExpression.properties.filter((property) => {
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

  // @ts-expect-error Type 'ObjectExpression' is not assignable to type 'T'.
  return objectExpression;
};
