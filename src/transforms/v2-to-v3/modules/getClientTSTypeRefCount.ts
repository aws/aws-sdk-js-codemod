import { Collection, JSCodeshift } from "jscodeshift";

import { getClientTSTypeRef } from "../utils";
import { ClientModulesOptions } from "./types";

export const getClientTSTypeRefCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ClientModulesOptions
): number => {
  let clientTSTypeRefCount = 0;

  if (v2GlobalName) {
    const clienTSTypeRefFromGlobalName = source.find(
      j.TSTypeReference,
      getClientTSTypeRef({ v2ClientName, v2GlobalName })
    );
    clientTSTypeRefCount += clienTSTypeRefFromGlobalName.length;
  }

  const clienTSTypeRefFromClientLocalName = source.find(
    j.TSTypeReference,
    getClientTSTypeRef({ v2ClientLocalName })
  );
  clientTSTypeRefCount += clienTSTypeRefFromClientLocalName.length;

  return clientTSTypeRefCount;
};
