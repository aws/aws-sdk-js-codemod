import { Collection, Identifier, JSCodeshift } from "jscodeshift";

import { getRequireDeclarators } from "./getRequireDeclarators";
import { removeRequireDeclarators } from "./removeRequireDeclarators";

export interface RemoveRequireIdentifierOptions {
  localName: string;
  sourceValue: string;
}

export const removeRequireIdentifier = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { localName, sourceValue }: RemoveRequireIdentifierOptions
) => {
  const id = { type: "Identifier", name: localName } as Identifier;
  removeRequireDeclarators(j, getRequireDeclarators(j, source, sourceValue, id));
};
