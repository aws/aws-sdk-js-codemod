import { ASTPath, JSCodeshift, TSQualifiedName } from "jscodeshift";
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
    v2ClientType.parentPath?.value.type === "TSTypeQuery" &&
    nativeTsTypes.includes(v3ClientTypeRef.type)
  ) {
    v2ClientType.parentPath?.replace(v3ClientTypeRef);
  } else {
    v2ClientType.replace(v3ClientTypeRef);
  }
};
