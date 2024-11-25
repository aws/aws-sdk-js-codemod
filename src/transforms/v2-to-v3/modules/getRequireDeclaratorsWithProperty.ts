import type { Collection, JSCodeshift } from "jscodeshift";
import { getRequireDeclarators } from "./requireModule/index.ts";

export interface GetRequireDeclaratorsWithPropertyOptions {
  localName?: string;
  identifierName?: string;
  sourceValue: string;
}

export const getRequireDeclaratorsWithProperty = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, identifierName, sourceValue }: GetRequireDeclaratorsWithPropertyOptions
) =>
  getRequireDeclarators(j, source, sourceValue).filter((varDeclarator) => {
    const declaratorId = varDeclarator.value.id;
    const declaratorInit = varDeclarator.value.init;

    if (declaratorId.type === "Identifier") {
      const declaratorIdName = declaratorId.name;
      if (
        declaratorInit?.type === "MemberExpression" &&
        declaratorInit.property.type === "Identifier"
      ) {
        const importedName = declaratorInit.property.name;
        if (localName === declaratorIdName && identifierName === importedName) {
          return true;
        }
      }
    }

    return false;
  });
