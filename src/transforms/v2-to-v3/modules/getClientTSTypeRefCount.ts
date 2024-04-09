import { Collection, JSCodeshift } from "jscodeshift";

import { getTSQualifiedNameFromClientName } from "../ts-type";
import { ClientModulesOptions } from "./types";

export const getClientTSTypeRefCount = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ClientModulesOptions
): number => {
  let clientTSTypeRefCount = 0;

  const clienTSTypeRefs = source.find(j.TSTypeReference, {
    typeName: getTSQualifiedNameFromClientName(v2ClientName, v2GlobalName),
  });
  clientTSTypeRefCount += clienTSTypeRefs.length;

  const clienTSTypeRefFromClientLocalName = source.find(j.TSTypeReference, {
    typeName: getTSQualifiedNameFromClientName(v2ClientLocalName),
  });
  clientTSTypeRefCount += clienTSTypeRefFromClientLocalName.length;

  return clientTSTypeRefCount;
};
