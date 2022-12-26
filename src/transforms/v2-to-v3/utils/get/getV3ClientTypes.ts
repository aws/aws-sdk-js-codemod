import { Collection, Identifier, JSCodeshift, TSQualifiedName } from "jscodeshift";

import { getV2ClientTypes, GetV2ClientTypesOptions } from "./getV2ClientTypes";
import { getV3ClientInputOutputType } from "./getV3ClientInputOutputType";

export const getV3ClientTypes = (
  j: JSCodeshift,
  source: Collection<unknown>,
  options: GetV2ClientTypesOptions
) =>
  getV2ClientTypes(j, source, options).map((tsTypeRef) =>
    getV3ClientInputOutputType(
      j,
      tsTypeRef,
      ((tsTypeRef.typeName as TSQualifiedName).right as Identifier).name
    )
  );
