import { JSCodeshift, TSType } from "jscodeshift";

import { CLIENT_TYPES_MAP } from "../config";
import { CLIENT_REQ_RESP_TYPES_MAP } from "../config/CLIENT_REQ_RESP_TYPES_MAP";
import { getDefaultLocalName } from "../utils";
import { getTypeForString } from "./getTypeForString";

export interface GetV3ClientTypeOptions {
  v2ClientLocalName: string;
  v2ClientName: string;
  v2ClientTypeName: string;
}

export const getV3ClientType = (
  j: JSCodeshift,
  { v2ClientLocalName, v2ClientName, v2ClientTypeName }: GetV3ClientTypeOptions
): TSType => {
  const clientReqRespTypesMap = CLIENT_REQ_RESP_TYPES_MAP[v2ClientName];
  const defaultLocalName = getDefaultLocalName(v2ClientLocalName);

  if (Object.keys(clientReqRespTypesMap).includes(v2ClientTypeName)) {
    return j.tsTypeReference(j.identifier(clientReqRespTypesMap[v2ClientTypeName]));
  }

  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];

  if (Object.keys(clientTypesMap).includes(v2ClientTypeName)) {
    return getTypeForString(j, defaultLocalName, clientTypesMap[v2ClientTypeName]);
  }

  return j.tsTypeReference(j.identifier(v2ClientTypeName));
};
