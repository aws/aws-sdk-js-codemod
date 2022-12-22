import { Collection, JSCodeshift } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";

export interface GetV2ClientIdNamesFromTSTypeRefOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

export const getV2ClientIdNamesFromTSTypeRef = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ClientName }: GetV2ClientIdNamesFromTSTypeRefOptions
): string[] => {
  const clientIdNamesFromDefaultModule = source
    .find(j.Identifier, {
      typeAnnotation: {
        typeAnnotation: {
          typeName: {
            left: { name: v2DefaultModuleName },
            right: { name: v2ClientName },
          },
        },
      },
    })
    .nodes()
    .map((identifier) => identifier.name);

  const clientIdNamesFromServiceModule = source
    .find(j.Identifier, {
      typeAnnotation: {
        typeAnnotation: {
          typeName: { type: "Identifier", name: v2ClientName },
        },
      },
    })
    .nodes()
    .map((identifier) => identifier.name);

  return getMergedArrayWithoutDuplicates(
    clientIdNamesFromDefaultModule,
    clientIdNamesFromServiceModule
  );
};
