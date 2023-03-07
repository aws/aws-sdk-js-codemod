import { Identifier, TSQualifiedName } from "jscodeshift";

export interface GetClientTypeNameOptions {
  v2ClientLocalName?: string;
  v2ClientName?: string;
  v2GlobalName?: string;
}

export const getClientTypeName = ({
  v2ClientLocalName,
  v2ClientName,
  v2GlobalName,
}: GetClientTypeNameOptions) => {
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
    return {
      type: "TSQualifiedName",
      left: { type: "Identifier", name: v2GlobalName },
      right: { type: "Identifier", name: v2ClientName },
    } as TSQualifiedName;
  }

  return { type: "Identifier", name: v2ClientLocalName } as Identifier;
};
