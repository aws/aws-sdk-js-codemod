import { ASTPath, Identifier, JSCodeshift, TSQualifiedName, TSTypeReference } from "jscodeshift";

import { getV3ClientTypeName } from "./getV3ClientTypeName";

export const getV3ClientType = (j: JSCodeshift, v2ClientType: ASTPath<TSTypeReference>) => {
  const v3ClientType = getV3ClientTypeName(
    ((v2ClientType.node.typeName as TSQualifiedName).right as Identifier).name
  );
  if (!v3ClientType) {
    return v2ClientType.node;
  }
  return j.tsTypeReference(j.identifier(v3ClientType));
};
