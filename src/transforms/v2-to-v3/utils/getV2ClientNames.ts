import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

import { getMergedArrayWithoutDuplicates } from "./getMergedArrayWithoutDuplicates";

export interface GetV2ClientNamesOptions {
  v2DefaultModuleName: string;
  v2ServiceModuleNames: string[];
}

export const getV2ClientNames = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2DefaultModuleName, v2ServiceModuleNames }: GetV2ClientNamesOptions
): string[] => {
  const v2ClientNamesFromDefaultModule = source
    .find(j.NewExpression, {
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: v2DefaultModuleName },
        property: { type: "Identifier" },
      },
    })
    .nodes()
    .map(
      (newExpression) => ((newExpression.callee as MemberExpression).property as Identifier).name
    );

  return getMergedArrayWithoutDuplicates(v2ClientNamesFromDefaultModule, v2ServiceModuleNames);
};
