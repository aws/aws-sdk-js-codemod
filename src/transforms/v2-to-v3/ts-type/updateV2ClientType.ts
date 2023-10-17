import { ASTPath, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";
import { DOCUMENT_CLIENT } from "../config";
import { ImportType } from "../modules";
import { addTsTypeQueryToRefType } from "./addTsTypeQueryToRefType";
import { getV3ClientType } from "./getV3ClientType";

const nativeTsRefTypes = ["TSAnyKeyword", "TSStringKeyword", "TSNumberKeyword", "TSBooleanKeyword"];
const nativeTsUnionTypes = ["Array", "Record"];
const nativeTsIdentifierTypes = ["Date", "Uint8Array", ...nativeTsUnionTypes];

interface UpdateV2ClientTypeOptions {
  v2ClientName: string;
  v2ClientTypeName: string;
  v2ClientLocalName: string;
  importType: ImportType;
}

export const updateV2ClientType = (
  j: JSCodeshift,
  v2ClientType: ASTPath<TSQualifiedName>,
  options: UpdateV2ClientTypeOptions
) => {
  const { importType } = options;
  const v2ClientLocalName =
    importType === ImportType.IMPORT_EQUALS &&
    options.v2ClientLocalName.endsWith(`.${DOCUMENT_CLIENT}`)
      ? "lib_dynamodb"
      : options.v2ClientLocalName;

  const v3ClientType = getV3ClientType(j, { ...options, v2ClientLocalName });

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
