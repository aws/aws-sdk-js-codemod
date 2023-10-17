import { ImportType } from "../modules";
import { getDefaultLocalName } from "../utils";

export const getV3ClientTypeName = (
  typeName: string,
  localName: string,
  importType: ImportType
) => {
  const v3ClientTypeNameSections = [typeName];
  if (importType === ImportType.IMPORT_EQUALS) {
    v3ClientTypeNameSections.unshift(getDefaultLocalName(localName));
  }
  return v3ClientTypeNameSections.join(".");
};
