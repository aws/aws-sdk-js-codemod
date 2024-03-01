import { Collection, JSCodeshift } from "jscodeshift";
import { removeDeclaration } from "../removeDeclaration";
import { getImportEqualsDeclarations } from "./getImportEqualsDeclarations";

export const removeImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  getImportEqualsDeclarations(j, source).forEach((importEqualsDeclaration) => {
    const localName = importEqualsDeclaration.value.id.name;
    const identifiers = source.find(j.Identifier, { name: localName });
    // One occurrence: local identifier.
    // ToDo: Check if there're another import equals from `@aws-sdk/`.
    if (identifiers.size() === 1) {
      removeDeclaration(j, source, importEqualsDeclaration.get());
    }
  });
