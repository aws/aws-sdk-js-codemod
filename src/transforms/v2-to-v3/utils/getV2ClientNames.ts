import { Collection, Identifier, JSCodeshift, MemberExpression } from "jscodeshift";

export interface GetV2ClientNamesOptions {
  v2DefaultModuleName: string;
  v2ClientModuleNames: string[];
}

export const getV2ClientNames = (
  j: JSCodeshift,
  source: Collection<any>,
  { v2DefaultModuleName, v2ClientModuleNames }: GetV2ClientNamesOptions
): Array<string> => {
  const v2ClientNamesFromDefaultImport = source
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

  // Merge v2ClientNamesFromDefaultImport with v2ClientImportNames with duplicates removed.
  return v2ClientNamesFromDefaultImport.concat(
    v2ClientModuleNames.filter(
      (v2ClientImportName) => v2ClientNamesFromDefaultImport.indexOf(v2ClientImportName) < 0
    )
  );
};
