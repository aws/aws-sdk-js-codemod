import { Identifier, JSCodeshift, TSTypeReference } from "jscodeshift";
import { getDefaultLocalName } from "../utils";

const nativeTsUnionTypes = ["Array", "Record"];

export const addTsTypeQueryToRefType = (j: JSCodeshift, v3ClientType: TSTypeReference) => {
  const { typeParameters } = v3ClientType;
  if (typeParameters?.type === "TSTypeParameterInstantiation") {
    for (const type of typeParameters.params) {
      if (type.type === "TSTypeReference") {
        const typeRef = type as TSTypeReference;
        if (typeRef.typeName.type === "Identifier") {
          const typeRefIdentifier = typeRef.typeName as Identifier;
          if (typeRefIdentifier.name.startsWith(getDefaultLocalName(""))) {
            // @ts-expect-error Type 'TSTypeQuery' is not assignable
            typeRef.typeName = j.tsTypeQuery(j.identifier(typeRefIdentifier.name));
          } else if (nativeTsUnionTypes.includes(typeRefIdentifier.name)) {
            addTsTypeQueryToRefType(j, typeRef);
          }
        }
      }
    }
  }
};
