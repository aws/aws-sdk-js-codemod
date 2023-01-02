import { Collection, Identifier, JSCodeshift, ObjectPattern } from "jscodeshift";

import { PACKAGE_NAME } from "../config";
import { getV2ServiceModulePath } from "../utils";
import { getRequireVariableDeclarator } from "./getRequireVariableDeclarator";

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
  const v2GlobalNameIdentifier = { type: "Identifier", name: v2GlobalName } as Identifier;
  // prettier-ignore
  const v2GlobalNameIdentifierDeclarator =
    getRequireVariableDeclarator(j, source, v2GlobalNameIdentifier, PACKAGE_NAME);

  if (v2GlobalNameIdentifierDeclarator && v2GlobalNameIdentifierDeclarator.nodes().length > 0) {
    return v2GlobalNameIdentifierDeclarator;
  }

  const v2ClientLocalNameObject = {
    type: "ObjectPattern",
    properties: [{ type: "Property", value: { type: "Identifier", name: v2ClientLocalName } }],
  } as ObjectPattern;
  // prettier-ignore
  const v2ClientLocalNameObjectDeclarator =
    getRequireVariableDeclarator(j, source, v2ClientLocalNameObject, PACKAGE_NAME);

  if (v2ClientLocalNameObjectDeclarator && v2ClientLocalNameObjectDeclarator.nodes().length > 0) {
    return v2ClientLocalNameObjectDeclarator;
  }

  const v2ServiceModulePath = getV2ServiceModulePath(v2ClientName);
  const v2ClientNameIdentifier = { type: "Identifier", name: v2ClientLocalName } as Identifier;
  // prettier-ignore
  const v2ClientNameIdentifierDeclarator =
    getRequireVariableDeclarator(j, source, v2ClientNameIdentifier, v2ServiceModulePath);

  if (v2ClientNameIdentifierDeclarator && v2ClientNameIdentifierDeclarator.nodes().length > 0) {
    return v2ClientNameIdentifierDeclarator;
  }
};
