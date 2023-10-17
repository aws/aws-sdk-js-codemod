import { JSCodeshift, TSType } from "jscodeshift";

import { CLIENT_TYPES_MAP } from "../config";
import { CLIENT_REQ_RESP_TYPES_MAP } from "../config/CLIENT_REQ_RESP_TYPES_MAP";
import { getTypeForString } from "./getTypeForString";

export interface GetV3ClientTypeOptions {
  v2ClientLocalName: string;
  v2ClientName: string;
  v2ClientTypeName: string;
}

export const getV3ClientType = (j: JSCodeshift, options: GetV3ClientTypeOptions): TSType => {
  const { v2ClientName, v2ClientLocalName, v2ClientTypeName } = options;
  const clientReqRespTypesMap = CLIENT_REQ_RESP_TYPES_MAP[v2ClientName];

  if (Object.keys(clientReqRespTypesMap).includes(v2ClientTypeName)) {
    const v3ClientTypeName = clientReqRespTypesMap[v2ClientTypeName];
    return j.tsTypeReference(j.identifier(v3ClientTypeName));
  }

  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];

  if (Object.keys(clientTypesMap).includes(v2ClientTypeName)) {
    return getTypeForString(j, v2ClientLocalName, clientTypesMap[v2ClientTypeName]);
  }

  return j.tsTypeReference(j.identifier(v2ClientTypeName));
};
