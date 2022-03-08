import { Collection, JSCodeshift } from "jscodeshift";

import { containsRequire } from "./containsRequire";
import { removeV2ClientImport } from "./removeV2ClientImport";
import { removeV2ClientRequire } from "./removeV2ClientRequire";

export const removeV2ClientModule = (
  j: JSCodeshift,
  source: Collection<any>,
  v2ClientName: string
) =>
  containsRequire(j, source)
    ? removeV2ClientRequire(j, source, v2ClientName)
    : removeV2ClientImport(j, source, v2ClientName);
