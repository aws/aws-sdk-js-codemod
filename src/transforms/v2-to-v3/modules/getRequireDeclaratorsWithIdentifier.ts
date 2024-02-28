import { Collection, JSCodeshift } from "jscodeshift";
import { getRequireDeclarators } from "./requireModule";

export interface GetRequireDeclaratorsWithIdentifier {
  identifierName: string;
  sourceValue: string;
}

export const getRequireDeclaratorsWithIdentifier = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { identifierName, sourceValue }: GetRequireDeclaratorsWithIdentifier
) =>
  getRequireDeclarators(j, source, sourceValue).filter((declarator) => {
    if (declarator.value.id.type !== "Identifier") {
      return false;
    }
    return declarator.value.id.name === identifierName;
  });
