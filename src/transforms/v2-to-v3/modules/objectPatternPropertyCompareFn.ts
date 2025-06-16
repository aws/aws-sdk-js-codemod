import type {
  ObjectProperty,
  Property,
  PropertyPattern,
  RestElement,
  RestProperty,
  SpreadProperty,
  SpreadPropertyPattern,
} from "jscodeshift";

export type ObjectPatternProperty =
  | Property
  | PropertyPattern
  | SpreadPropertyPattern
  | SpreadProperty
  | ObjectProperty
  | RestElement
  | RestProperty;

export const objectPatternPropertyCompareFn = (
  property1: ObjectPatternProperty,
  property2: ObjectPatternProperty
) => {
  if (property1.type !== "Property" && property1.type !== "ObjectProperty") {
    return 0;
  }
  if (property2.type !== "Property" && property2.type !== "ObjectProperty") {
    return 0;
  }
  if (property1.key.type === "Identifier" && property2.key.type === "Identifier") {
    return property1.key.name.localeCompare(property2.key.name);
  }
  return 0;
};
