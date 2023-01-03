import { Collection, Identifier, JSCodeshift } from "jscodeshift";

export const getV2ClientNamesFromTSQualifiedName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] =>
  source
    .find(j.TSQualifiedName, {
      left: { name: v2GlobalName },
    })
    .nodes()
    .map((tsTypeReference) => (tsTypeReference.right as Identifier).name);
