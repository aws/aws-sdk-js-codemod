import { Identifier, TSQualifiedName, TSTypeReference } from "jscodeshift";

export interface V2ClientTsTypeRefOptions {
  v2DefaultModuleName?: string;
  v2ClientName: string;
  isType?: boolean;
}

export const getV2ClientTSTypeRef = ({
  v2DefaultModuleName,
  v2ClientName,
  isType = false,
}: V2ClientTsTypeRefOptions): TSTypeReference => {
  if (v2DefaultModuleName) {
    const idWithGlobalName = {
      type: "TSQualifiedName",
      left: { type: "Identifier", name: v2DefaultModuleName },
      right: { type: "Identifier", name: v2ClientName },
    } as TSQualifiedName;

    return {
      typeName: {
        ...(isType ? { left: idWithGlobalName, right: { type: "Identifier" } } : idWithGlobalName),
      },
    } as TSTypeReference;
  }

  const idWithClientName = { type: "Identifier", name: v2ClientName } as Identifier;
  return {
    typeName: {
      ...(isType ? { left: idWithClientName, right: { type: "Identifier" } } : idWithClientName),
    },
  } as TSTypeReference;
};
