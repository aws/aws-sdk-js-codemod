import { strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

import { CLIENT_NAMES_MAP } from "../config/index.ts";
import { getV3ClientName } from "./getV3ClientName.ts";

describe(getV3ClientName.name, () => {
  for (const [input, output] of Object.entries(CLIENT_NAMES_MAP)) {
    it(`getV3ClientName('${input}') === '${output}'`, () => {
      strictEqual(getV3ClientName(input), output);
    });
  }

  for (const deprecatedClient of ["ImportExport", "MobileAnalytics", "SimpleDB"]) {
    it(`throws for deprecated client '${deprecatedClient}'`, () => {
      throws(
        () => {
          getV3ClientName(deprecatedClient);
        },
        new Error(`Client '${deprecatedClient}' is either deprecated or newly added.`)
      );
    });
  }

  for (const unknownClient of ["UNDEFINED", "NULL", "UNKNOWN"]) {
    it(`throws for unknown client '${unknownClient}'`, () => {
      throws(
        () => {
          getV3ClientName(unknownClient);
        },
        new Error(`Client '${unknownClient}' is either deprecated or newly added.`)
      );
    });
  }
});
