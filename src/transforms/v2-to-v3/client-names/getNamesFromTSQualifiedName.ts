import type { Collection, Identifier, JSCodeshift } from "jscodeshift";

export const getNamesFromTSQualifiedName = (
  j: JSCodeshift,
  source: Collection<unknown>,
  v2GlobalName: string
): string[] =>
  source
    .find(j.TSQualifiedName, {
      left: { name: v2GlobalName },
      right: { type: "Identifier" },
    })
    .nodes()
    .map((tsTypeReference) => (tsTypeReference.right as Identifier).name);
