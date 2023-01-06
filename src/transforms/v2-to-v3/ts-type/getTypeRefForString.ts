import { JSCodeshift, TSType } from "jscodeshift";

const arrayRegex = /^Array<(.*)>$/;
const recordRegex = /^Record<string, (.*)>$/;

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

  if (["Date", "Uint8Array"].includes(v3ClientTypeString)) {
    return j.tsTypeReference(j.identifier(v3ClientTypeString));
  }

  if (v3ClientTypeString.startsWith("Array<")) {
    const type = arrayRegex.exec(v3ClientTypeString)![1];
    const typeArgument = getTypeRefForString(j, v3ClientDefaultLocalName, type);
    return j.tsTypeReference.from({
      typeName: j.identifier("Array"),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeParameters: j.tsTypeParameterInstantiation([typeArgument]),
    });
  }

  if (v3ClientTypeString.startsWith("Record<")) {
    const type = recordRegex.exec(v3ClientTypeString)![1];
    const typeArgument = getTypeRefForString(j, v3ClientDefaultLocalName, type);
    return j.tsTypeReference.from({
      typeName: j.identifier("Record"),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeParameters: j.tsTypeParameterInstantiation([j.tsStringKeyword(), typeArgument]),
    });
  }

  return j.tsTypeReference(j.identifier([v3ClientDefaultLocalName, v3ClientTypeString].join(".")));
};
