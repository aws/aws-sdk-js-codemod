import { JSCodeshift } from "jscodeshift";

export interface V3ClientRequirePropertyOptions {
  keyName: string;
  valueName: string;
}

export const getV3ClientRequireProperty = (
  j: JSCodeshift,
  { keyName, valueName }: V3ClientRequirePropertyOptions
) => j.objectProperty(j.identifier(keyName), j.identifier(valueName));
