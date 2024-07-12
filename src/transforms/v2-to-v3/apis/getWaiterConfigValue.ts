import type { ObjectExpression, ObjectProperty, Property } from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";

export const getWaiterConfigValue = (
  waiterConfiguration: ObjectExpression | undefined,
  key: string
): string | undefined => {
  if (!waiterConfiguration) {
    return;
  }
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
      // @ts-expect-error value is Literal/StringLiteral
      return propertyValue.value;
    }
  }
};
