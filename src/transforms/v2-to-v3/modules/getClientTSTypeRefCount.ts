import { Collection, JSCodeshift } from "jscodeshift";

import { getV2ClientTSTypeRef } from "../utils";
import { V3ClientModulesOptions } from "./types";

export const getClientTSTypeRefCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: V3ClientModulesOptions
): number => {
  let clientTSTypeRefCount = 0;

  if (v2GlobalName) {
    const clienTSTypeRefFromGlobalName = source.find(
      j.TSTypeReference,
      getV2ClientTSTypeRef({ v2ClientName, v2GlobalName })
    );
    clientTSTypeRefCount += clienTSTypeRefFromGlobalName.length;
  }

  const clienTSTypeRefFromClientLocalName = source.find(
    j.TSTypeReference,
    getV2ClientTSTypeRef({ v2ClientLocalName })
  );
  clientTSTypeRefCount += clienTSTypeRefFromClientLocalName.length;

  return clientTSTypeRefCount;
};
