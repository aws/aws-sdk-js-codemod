import { Collection, JSCodeshift } from "jscodeshift";
import { removeDeclaration } from "../removeDeclaration";
import { getImportEqualsDeclarations } from "./getImportEqualsDeclarations";

const isAnotherSpecifier = (j: JSCodeshift, source: Collection<unknown>, localName: string) =>
  source.find(j.TSImportEqualsDeclaration, { id: { name: localName } }).size() > 1;

export const removeImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  getImportEqualsDeclarations(j, source).forEach((importEqualsDeclaration) => {
    const localName = importEqualsDeclaration.value.id.name;
    const identifiers = source.find(j.Identifier, { name: localName });
    // One occurrence: local identifier.
    if (identifiers.size() === 1 || isAnotherSpecifier(j, source, localName)) {
      removeDeclaration(j, source, importEqualsDeclaration.get());
    }
  });
