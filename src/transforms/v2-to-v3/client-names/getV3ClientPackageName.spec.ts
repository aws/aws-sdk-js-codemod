import { strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

import { CLIENT_PACKAGE_NAMES_MAP } from "../config";
import { getV3ClientPackageName } from "./getV3ClientPackageName";

describe(getV3ClientPackageName.name, () => {
  for (const [input, output] of Object.entries(CLIENT_PACKAGE_NAMES_MAP)) {
    it("getClientName('%s') === '%s'", () => {
      strictEqual(getV3ClientPackageName(input), `@aws-sdk/${output}`);
    });
  }

  for (const deprecatedClient of ["ImportExport", "MobileAnalytics", "SimpleDB"]) {
    it("throws for deprecated client '%s'", () => {
      throws(
        () => {
          getV3ClientPackageName(deprecatedClient);
        },
        new Error(`Client '${deprecatedClient}' is either deprecated or newly added.`)
      );
    });
  }

  for (const unknownClient of ["UNDEFINED", "NULL", "UNKNOWN"]) {
    it("throws for unknown client '%s'", () => {
      throws(
        () => {
          getV3ClientPackageName(unknownClient);
        },
        new Error(`Client '${unknownClient}' is either deprecated or newly added.`)
      );
    });
  }
});
