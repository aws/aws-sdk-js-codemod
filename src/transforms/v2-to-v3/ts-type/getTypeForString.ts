import { JSCodeshift, TSType } from "jscodeshift";
import { ImportType } from "../modules";
import { getV3ClientTypeName } from "./getV3ClientTypeName";

const arrayRegex = /^Array<(.*)>$/;
const recordRegex = /^Record<string, (.*)>$/;

export interface GetTypeForStringOptions {
  v2ClientLocalName: string;
  v3ClientTypeString: string;
}

export const getTypeForString = (
  j: JSCodeshift,
  importType: ImportType,
  { v2ClientLocalName, v3ClientTypeString }: GetTypeForStringOptions
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
    const typeArgument = getTypeForString(j, importType, {
      v2ClientLocalName,
      v3ClientTypeString: type,
    });
    return j.tsTypeReference.from({
      typeName: j.identifier("Array"),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeParameters: j.tsTypeParameterInstantiation([typeArgument]),
    });
  }

  const recordRegexMatches = recordRegex.exec(v3ClientTypeString);
  if (recordRegexMatches) {
    const type = recordRegexMatches[1];
    const typeArgument = getTypeForString(j, importType, {
      v2ClientLocalName,
      v3ClientTypeString: type,
    });
    return j.tsTypeReference.from({
      typeName: j.identifier("Record"),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeParameters: j.tsTypeParameterInstantiation([j.tsStringKeyword(), typeArgument]),
    });
  }

  return j.tsTypeReference(
    j.identifier(getV3ClientTypeName(v3ClientTypeString, v2ClientLocalName, importType))
  );
};
