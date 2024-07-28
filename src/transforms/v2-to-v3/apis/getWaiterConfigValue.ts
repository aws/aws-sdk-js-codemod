import type { ObjectExpression, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";

export const getWaiterConfigValue = (waiterConfiguration: ObjectExpression, key: string) => {
  for (const property of waiterConfiguration.properties) {
    if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
      continue;
    }
    const propertyKey = (property as Property | ObjectProperty).key;
    const propertyValue = (property as Property | ObjectProperty).value;
    if (propertyKey.type !== "Identifier") {
      continue;
    }
    if (propertyKey.name === key) {
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
