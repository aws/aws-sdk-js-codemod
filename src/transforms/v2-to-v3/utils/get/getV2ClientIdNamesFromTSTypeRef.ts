import { Collection, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";

export interface GetV2ClientIdNamesFromTSTypeRefOptions {
  v2ClientName: string;
  v2GlobalName?: string;
}

export const getV2ClientIdNamesFromTSTypeRef = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2GlobalName, v2ClientName }: GetV2ClientIdNamesFromTSTypeRefOptions
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

  return getMergedArrayWithoutDuplicates(namesFromGlobalName, namesFromClientName);
};
