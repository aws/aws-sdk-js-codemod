import type { Collection, JSCodeshift } from "jscodeshift";

export interface GetClientIdNamesFromTSTypeRefOptions {
  v2ClientName: string;
  v2GlobalName?: string;
}

export const getClientIdNamesFromTSTypeRef = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, v2ClientName }: GetClientIdNamesFromTSTypeRefOptions
): string[] => {
  const namesFromGlobalName = v2GlobalName
    ? source
        .find(j.Identifier, {
          typeAnnotation: {
            typeAnnotation: {
              typeName: {
                left: { name: v2GlobalName },
                right: { name: v2ClientName },
              },
            },
          },
        })
        .nodes()
        .map((identifier) => identifier.name)
    : [];

  const namesFromClientName = source
    .find(j.Identifier, {
      typeAnnotation: {
        typeAnnotation: {
          typeName: { type: "Identifier", name: v2ClientName },
        },
      },
    })
    .nodes()
    .map((identifier) => identifier.name);

  return [...new Set([...namesFromGlobalName, ...namesFromClientName])];
};
