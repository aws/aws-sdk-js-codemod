import type { Collection, JSCodeshift } from "jscodeshift";
import { removeDeclaration } from "../removeDeclaration";
import { getImportEqualsDeclarations } from "./getImportEqualsDeclarations";

const isAnotherSpecifier = (j: JSCodeshift, source: Collection<unknown>, localName: string) =>
  source.find(j.TSImportEqualsDeclaration, { id: { name: localName } }).size() > 1;

export const removeImportEquals = (j: JSCodeshift, source: Collection<unknown>) =>
  getImportEqualsDeclarations(j, source).forEach((importEqualsDeclaration) => {
    const localName = importEqualsDeclaration.value.id.name;
    if (typeof localName !== "string") {
      throw new Error("Please report your use case on https://github.com/aws/aws-sdk-js-codemod");
    }
    const identifiers = source.find(j.Identifier, { name: localName });

    // Either the identifier is the only occurence on the page.
    // Or there is another specifier with the same name imported from JS SDK v3.
    if (identifiers.size() === 1 || isAnotherSpecifier(j, source, localName)) {
      removeDeclaration(j, source, importEqualsDeclaration.get());
    }
  });
