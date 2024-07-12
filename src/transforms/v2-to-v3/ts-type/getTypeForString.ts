import type { JSCodeshift, TSType } from "jscodeshift";

const arrayRegex = /^Array<(.*)>$/;
const recordRegex = /^Record<string, (.*)>$/;

export const getTypeForString = (
  j: JSCodeshift,
  v2ClientLocalName: string,
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

  if (["Date", "Uint8Array"].includes(v3ClientTypeString)) {
    return j.tsTypeReference(j.identifier(v3ClientTypeString));
  }

  const arrayRegexMatches = arrayRegex.exec(v3ClientTypeString);
  if (arrayRegexMatches) {
    const type = arrayRegexMatches[1];
    const typeArgument = getTypeForString(j, v2ClientLocalName, type);
    return j.tsTypeReference.from({
      typeName: j.identifier("Array"),

      // @ts-ignore
      typeParameters: j.tsTypeParameterInstantiation([typeArgument]),
    });
  }

  const recordRegexMatches = recordRegex.exec(v3ClientTypeString);
  if (recordRegexMatches) {
    const type = recordRegexMatches[1];
    const typeArgument = getTypeForString(j, v2ClientLocalName, type);
    return j.tsTypeReference.from({
      typeName: j.identifier("Record"),

      // @ts-ignore
      typeParameters: j.tsTypeParameterInstantiation([j.tsStringKeyword(), typeArgument]),
    });
  }

  return j.tsTypeReference(j.identifier(v3ClientTypeString));
};
