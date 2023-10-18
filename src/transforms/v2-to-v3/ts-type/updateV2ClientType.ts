import { ASTPath, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";
import { getV3ClientType } from "./getV3ClientType";

const nativeTsRefTypes = ["TSAnyKeyword", "TSStringKeyword", "TSNumberKeyword", "TSBooleanKeyword"];
const nativeTsIdentifierTypes = ["Date", "Uint8Array", "Array", "Record"];

interface UpdateV2ClientTypeOptions {
  v2ClientName: string;
  v2ClientTypeName: string;
  v2ClientLocalName: string;
}

export const updateV2ClientType = (
  j: JSCodeshift,
  v2ClientType: ASTPath<TSQualifiedName>,
  options: UpdateV2ClientTypeOptions
) => {
  const v3ClientType = getV3ClientType(j, options);

  if (
    (v2ClientType.parentPath?.value.type === "TSTypeQuery" &&
      nativeTsRefTypes.includes(v3ClientType.type)) ||
    (v3ClientType.type === "TSTypeReference" &&
      (v3ClientType as TSTypeReference).typeName.type === "Identifier" &&
      nativeTsIdentifierTypes.includes(
        ((v3ClientType as TSTypeReference).typeName as Identifier).name
      ))
  ) {
    v2ClientType.parentPath?.replace(v3ClientType);
  } else {
    v2ClientType.replace(v3ClientType);
  }
};
