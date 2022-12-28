import { Identifier, TSQualifiedName, TSTypeReference } from "jscodeshift";

export interface V2ClientTsTypeRefOptions {
  v2DefaultModuleName?: string;
  v2ClientName: string;
  withoutRightSection?: boolean;
}

export const getV2ClientTSTypeRef = ({
  v2DefaultModuleName,
  v2ClientName,
  withoutRightSection = false,
}: V2ClientTsTypeRefOptions): TSTypeReference => {
  if (v2DefaultModuleName) {
    const idWithGlobalName = {
      type: "TSQualifiedName",
      left: { type: "Identifier", name: v2DefaultModuleName },
      right: { type: "Identifier", name: v2ClientName },
    } as TSQualifiedName;

    return {
      typeName: {
        ...(withoutRightSection ? { left: idWithGlobalName } : idWithGlobalName),
      },
    } as TSTypeReference;
  }

  const idWithClientName = { type: "Identifier", name: v2ClientName } as Identifier;
  return {
    typeName: {
      ...(withoutRightSection ? { left: idWithClientName } : idWithClientName),
    },
  } as TSTypeReference;
};
