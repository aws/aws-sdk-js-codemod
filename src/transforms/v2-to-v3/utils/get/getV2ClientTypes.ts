import { Collection, JSCodeshift } from "jscodeshift";

export interface GetV2ClientTypesOptions {
  v2ClientName: string;
  v2DefaultModuleName: string;
}

export const getV2ClientTypes = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2DefaultModuleName }: GetV2ClientTypesOptions
) =>
  source.find(j.TSTypeReference, {
    typeName: {
      left: {
        left: { type: "Identifier", name: v2DefaultModuleName },
        right: { type: "Identifier", name: v2ClientName },
      },
    },
  });
