import { JSCodeshift, TSType } from "jscodeshift";

import { CLIENT_TYPES_MAP } from "../config";
import { CLIENT_REQ_RESP_TYPES_MAP } from "../config/CLIENT_REQ_RESP_TYPES_MAP";
import { ImportType } from "../modules";
import { getDefaultLocalName } from "../utils";
import { getTypeForString } from "./getTypeForString";

export interface GetV3ClientTypeOptions {
  v2ClientLocalName: string;
  v2ClientName: string;
  v2ClientTypeName: string;
  importType: ImportType;
}

const getV3ClientTypeName = (
  v3ClientTypeName: string,
  v2ClientLocalName: string,
  importType: ImportType
) => {
  const v3ClientTypeNameSections = [v3ClientTypeName];
  if (importType === ImportType.IMPORT_EQUALS) {
    v3ClientTypeNameSections.unshift(getDefaultLocalName(v2ClientLocalName));
  }
  return v3ClientTypeNameSections.join(".");
};

export const getV3ClientType = (
  j: JSCodeshift,
  { v2ClientLocalName, v2ClientName, v2ClientTypeName, importType }: GetV3ClientTypeOptions
): TSType => {
  const clientReqRespTypesMap = CLIENT_REQ_RESP_TYPES_MAP[v2ClientName];
  const defaultLocalName = getDefaultLocalName(v2ClientLocalName);

  if (Object.keys(clientReqRespTypesMap).includes(v2ClientTypeName)) {
    const v3ClientTypeName = clientReqRespTypesMap[v2ClientTypeName];
    return j.tsTypeReference(
      j.identifier(getV3ClientTypeName(v3ClientTypeName, v2ClientLocalName, importType))
    );
  }

  const clientTypesMap = CLIENT_TYPES_MAP[v2ClientName];

  if (Object.keys(clientTypesMap).includes(v2ClientTypeName)) {
    return getTypeForString(j, importType, {
      v3ClientDefaultLocalName: defaultLocalName,
      v3ClientTypeString: clientTypesMap[v2ClientTypeName],
    });
  }

  return j.tsTypeReference(
    j.identifier(getV3ClientTypeName(v2ClientTypeName, v2ClientLocalName, importType))
  );
};
