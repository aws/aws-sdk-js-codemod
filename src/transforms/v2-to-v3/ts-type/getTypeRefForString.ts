import { JSCodeshift, TSType } from "jscodeshift";

export const getTypeRefForString = (
  j: JSCodeshift,
  v3ClientDefaultLocalName: string,
  v3ClientTypeString: string
): TSType => {
  return j.tsStringKeyword();
};
