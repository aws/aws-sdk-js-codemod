import { Identifier, TSTypeReference } from "jscodeshift";
import { getDefaultLocalName } from "../utils";

const nativeTsUnionTypes = ["Array", "Record"];

export const addTsTypeQueryToRefType = (v3ClientType: TSTypeReference) => {
  const { typeParameters } = v3ClientType;
  if (typeParameters?.type === "TSTypeParameterInstantiation") {
    for (const type of typeParameters.params) {
      if (type.type === "TSTypeReference") {
        const typeRef = type as TSTypeReference;
        if (typeRef.typeName.type === "Identifier") {
          const typeRefIdentifier = typeRef.typeName as Identifier;
          if (typeRefIdentifier.name.startsWith(getDefaultLocalName(""))) {
            // TODO: Add TS Type Query to typeRefIdentifier instead.
            typeRefIdentifier.name = `typeof ${typeRefIdentifier.name}`;
          } else if (nativeTsUnionTypes.includes(typeRefIdentifier.name)) {
            addTsTypeQueryToRefType(typeRef);
          }
        }
      }
    }
  }
};
