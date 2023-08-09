import { ASTPath, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";
import { addTsTypeQueryToRefType } from "./addTsTypeQueryToRefType";
import { getV3ClientType } from "./getV3ClientType";

const nativeTsRefTypes = ["TSAnyKeyword", "TSStringKeyword", "TSNumberKeyword", "TSBooleanKeyword"];
const nativeTsUnionTypes = ["Array", "Record"];
const nativeTsIdentifierTypes = ["Date", "Uint8Array", ...nativeTsUnionTypes];

interface UpdateV2ClientTypeOptions {
  v2ClientName: string;
  v2ClientTypeName: string;
  v2ClientLocalName: string;
}

export const updateV2ClientType = (
  j: JSCodeshift,
  v2ClientType: ASTPath<TSQualifiedName>,
  { v2ClientName, v2ClientTypeName, v2ClientLocalName }: UpdateV2ClientTypeOptions
) => {
  const v3ClientType = getV3ClientType(j, { v2ClientName, v2ClientTypeName, v2ClientLocalName });

  if (v2ClientType.parentPath?.value.type === "TSTypeQuery") {
    if (nativeTsRefTypes.includes(v3ClientType.type)) {
      v2ClientType.parentPath?.replace(v3ClientType);
      return;
    }

    if (v3ClientType.type === "TSTypeReference") {
      const v3ClientTypeRef = v3ClientType as TSTypeReference;
      if (v3ClientTypeRef.typeName.type === "Identifier") {
        const v3ClientTypeRefIdentifier = v3ClientTypeRef.typeName as Identifier;
        if (nativeTsIdentifierTypes.includes(v3ClientTypeRefIdentifier.name)) {
          if (nativeTsUnionTypes.includes(v3ClientTypeRefIdentifier.name)) {
            addTsTypeQueryToRefType(j, v3ClientTypeRef);
          }
          v2ClientType.parentPath?.replace(v3ClientType);
          return;
        }
      }
    }
  }

  v2ClientType.replace(v3ClientType);
};
