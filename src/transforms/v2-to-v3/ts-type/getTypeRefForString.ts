import { JSCodeshift, TSType } from "jscodeshift";

export const getTypeRefForString = (
  j: JSCodeshift,
  v3ClientDefaultLocalName: string,
  v3ClientTypeString: string
): TSType => {
  if (v3ClientTypeString === "string") {
    return j.tsStringKeyword();
  }

  if (v3ClientTypeString === "number") {
    return j.tsNumberKeyword();
  }

  if (v3ClientTypeString === "boolean") {
    return j.tsBooleanKeyword();
  }

  return j.tsStringKeyword();
};
