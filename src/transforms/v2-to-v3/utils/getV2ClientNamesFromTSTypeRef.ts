import { Collection, Identifier, JSCodeshift, TSQualifiedName } from "jscodeshift";

export const getV2ClientNamesFromTSTypeRef = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2DefaultModuleName: string
): string[] =>
  source
    .find(j.TSTypeReference, {
      typeName: { left: { name: v2DefaultModuleName } },
    })
    .nodes()
    .map(
      (tsTypeReference) => ((tsTypeReference.typeName as TSQualifiedName).right as Identifier).name
    );
