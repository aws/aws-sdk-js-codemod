import { Collection, JSCodeshift } from "jscodeshift";

import { ClientModulesOptions } from "./types";

export const getClientTSTypeRefCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ClientModulesOptions
): number => {
  let clientTSTypeRefCount = 0;

  if (v2GlobalName) {
    const clienTSTypeRefFromGlobalName = source.find(j.TSTypeReference, {
      typeName: {
        left: { type: "Identifier", name: v2GlobalName },
        right: { type: "Identifier", name: v2ClientName },
      },
    });
    clientTSTypeRefCount += clienTSTypeRefFromGlobalName.length;
  }

  const clienTSTypeRefFromClientLocalName = source.find(j.TSTypeReference, {
    typeName: { type: "Identifier", name: v2ClientLocalName },
  });
  clientTSTypeRefCount += clienTSTypeRefFromClientLocalName.length;

  return clientTSTypeRefCount;
};
