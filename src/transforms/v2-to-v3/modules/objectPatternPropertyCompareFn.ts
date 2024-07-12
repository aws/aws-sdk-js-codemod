import type {
  ObjectProperty,
  Property,
  PropertyPattern,
  RestProperty,
  SpreadProperty,
  SpreadPropertyPattern,
} from "jscodeshift";

import { OBJECT_PROPERTY_TYPE_LIST } from "../config";

export type ObjectPatternProperty =
  | Property
  | PropertyPattern
  | SpreadPropertyPattern
  | SpreadProperty
  | ObjectProperty
  | RestProperty;

export const objectPatternPropertyCompareFn = (
  property1: ObjectPatternProperty,
  property2: ObjectPatternProperty
) => {
  if (
    OBJECT_PROPERTY_TYPE_LIST.includes(property1.type) &&
    OBJECT_PROPERTY_TYPE_LIST.includes(property2.type)
  ) {
    const property1Key = (property1 as Property | ObjectProperty).key;
    const property2Key = (property2 as Property | ObjectProperty).key;
    if (property1Key.type === "Identifier" && property2Key.type === "Identifier")
      return property1Key.name.localeCompare(property2Key.name);
  }
  return 0;
};
