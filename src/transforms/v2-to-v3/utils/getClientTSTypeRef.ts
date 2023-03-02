import { Identifier, TSQualifiedName, TSTypeReference } from "jscodeshift";

export interface GetClientTsTypeRefOptions {
  v2ClientLocalName?: string;
  v2ClientName?: string;
  v2GlobalName?: string;
  withoutRightSection?: boolean;
}

export const getClientTSTypeRef = ({
  v2ClientLocalName,
  v2ClientName,
  v2GlobalName,
  withoutRightSection = false,
}: GetClientTsTypeRefOptions): TSTypeReference => {
  if (!v2GlobalName && !v2ClientLocalName) {
    throw new Error(
      `One of the following options must be provided: v2ClientLocalName, v2GlobalName`
    );
  }

  if (v2GlobalName && v2ClientLocalName) {
    throw new Error(
      `Only one of the following options must be provided: v2ClientLocalName, v2GlobalName`
    );
  }

  if (v2GlobalName) {
    const idWithGlobalName = {
      type: "TSQualifiedName",
      left: { type: "Identifier", name: v2GlobalName },
      right: { type: "Identifier", name: v2ClientName },
    } as TSQualifiedName;

    return {
      typeName: {
        ...(withoutRightSection ? { left: idWithGlobalName } : idWithGlobalName),
      },
    } as TSTypeReference;
  }

  const idWithClientName = { type: "Identifier", name: v2ClientLocalName } as Identifier;
  return {
    typeName: {
      ...(withoutRightSection ? { left: idWithClientName } : idWithClientName),
    },
  } as TSTypeReference;
};
