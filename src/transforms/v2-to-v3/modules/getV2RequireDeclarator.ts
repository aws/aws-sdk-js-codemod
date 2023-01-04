import { Collection, Identifier, JSCodeshift, ObjectPattern } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath } from "../utils";
import { getRequireVariableDeclarators } from "./getRequireVariableDeclarators";

export interface GetV2BaseDeclaratorOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const getV2RequireDeclarator = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: GetV2BaseDeclaratorOptions
) => {
  if (v2GlobalName) {
    const v2GlobalNameIdentifier = { type: "Identifier", name: v2GlobalName } as Identifier;
    // prettier-ignore
    const v2GlobalNameIdentifierDeclarators =
      getRequireVariableDeclarators(j, source, PACKAGE_NAME, v2GlobalNameIdentifier);

    if (v2GlobalNameIdentifierDeclarators && v2GlobalNameIdentifierDeclarators.nodes().length > 0) {
      return v2GlobalNameIdentifierDeclarators;
    }
  }

  const v2ClientLocalNameObject = {
    type: "ObjectPattern",
    properties: [{ type: "Property", value: { type: "Identifier", name: v2ClientLocalName } }],
  } as ObjectPattern;
  // prettier-ignore
  const v2ClientLocalNameObjectDeclarators =
    getRequireVariableDeclarators(j, source, PACKAGE_NAME, v2ClientLocalNameObject);

  if (v2ClientLocalNameObjectDeclarators && v2ClientLocalNameObjectDeclarators.nodes().length > 0) {
    return v2ClientLocalNameObjectDeclarators;
  }

  const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
  const v2ClientNameIdentifier = { type: "Identifier", name: v2ClientLocalName } as Identifier;
  // prettier-ignore
  const v2ClientNameIdentifierDeclarators =
    getRequireVariableDeclarators(j, source, v2ServiceModulePath, v2ClientNameIdentifier);

  if (v2ClientNameIdentifierDeclarators && v2ClientNameIdentifierDeclarators.nodes().length > 0) {
    return v2ClientNameIdentifierDeclarators;
  }
};
