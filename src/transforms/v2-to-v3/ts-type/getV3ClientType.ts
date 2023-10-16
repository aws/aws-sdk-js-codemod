import { JSCodeshift, TSType } from "jscodeshift";

import { CLIENT_TYPES_MAP } from "../config";
import { CLIENT_REQ_RESP_TYPES_MAP } from "../config/CLIENT_REQ_RESP_TYPES_MAP";
import { ImportType } from "../modules";
import { getTypeForString } from "./getTypeForString";
import { getV3ClientTypeName } from "./getV3ClientTypeName";

export interface GetV3ClientTypeOptions {
  v2ClientLocalName: string;
  v2ClientName: string;
  v2ClientTypeName: string;
  importType: ImportType;
}

export const getV3ClientType = (
  j: JSCodeshift,
  { v2ClientLocalName, v2ClientName, v2ClientTypeName, importType }: GetV3ClientTypeOptions
): TSType => {
  const clientReqRespTypesMap = CLIENT_REQ_RESP_TYPES_MAP[v2ClientName];

  if (Object.keys(clientReqRespTypesMap).includes(v2ClientTypeName)) {
    const v3ClientTypeName = clientReqRespTypesMap[v2ClientTypeName];
    return j.tsTypeReference(
      j.identifier(getV3ClientTypeName(v3ClientTypeName, v2ClientLocalName, importType))
    );
  }

  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];

  if (Object.keys(clientTypesMap).includes(v2ClientTypeName)) {
    return getTypeForString(j, importType, {
      v2ClientLocalName,
      v3ClientTypeString: clientTypesMap[v2ClientTypeName],
    });
  }

  return j.tsTypeReference(
    j.identifier(getV3ClientTypeName(v2ClientTypeName, v2ClientLocalName, importType))
  );
};
