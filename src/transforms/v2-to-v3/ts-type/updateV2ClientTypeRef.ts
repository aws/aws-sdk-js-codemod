import { ASTPath, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";
import { getV3ClientTypeReference } from "./getV3ClientTypeReference";

const nativeTsTypes = ["TSAnyKeyword", "TSStringKeyword", "TSNumberKeyword", "TSBooleanKeyword"];

interface UpdateV2ClientTypeRefOptions {
  v2ClientName: string;
  v2ClientTypeName: string;
  v2ClientLocalName: string;
}

export const updateV2ClientTypeRef = (
  j: JSCodeshift,
  v2ClientType: ASTPath<TSQualifiedName>,
  { v2ClientName, v2ClientTypeName, v2ClientLocalName }: UpdateV2ClientTypeRefOptions
) => {
  const v3ClientTypeRef = getV3ClientTypeReference(j, {
    v2ClientName,
    v2ClientTypeName,
    v2ClientLocalName,
  });

  if (
    (v2ClientType.parentPath?.value.type === "TSTypeQuery" &&
      nativeTsTypes.includes(v3ClientTypeRef.type)) ||
    (v3ClientTypeRef.type === "TSTypeReference" &&
      (v3ClientTypeRef as TSTypeReference).typeName.type === "Identifier" &&
      ["Date", "Uint8Array"].includes(
        ((v3ClientTypeRef as TSTypeReference).typeName as Identifier).name
      ))
  ) {
    v2ClientType.parentPath?.replace(v3ClientTypeRef);
  } else {
    v2ClientType.replace(v3ClientTypeRef);
  }
};
