import { describe, expect, it } from "vitest";

import { getV3ClientPackageName } from "./getV3ClientPackageName";
import { CLIENT_PACKAGE_NAMES_MAP } from "../config";

describe(getV3ClientPackageName.name, () => {
  it.each(Object.entries(CLIENT_PACKAGE_NAMES_MAP))(
    "getClientName('%s') === '%s'",
    (input, output) => {
      expect(getV3ClientPackageName(input)).toBe(`@aws-sdk/${output}`);
    }
  );

  it.each(["ImportExport", "MobileAnalytics", "SimpleDB"])(
    "throws for deprecated client '%s'",
    (deprecatedClient) => {
      expect(() => {
        getV3ClientPackageName(deprecatedClient);
      }).toThrow(new Error(`Client '${deprecatedClient}' is either deprecated or newly added.`));
    }
  );

  it.each(["UNDEFINED", "NULL", "UNKNOWN"])("throws for unknown client '%s'", (unknownClient) => {
    expect(() => {
      getV3ClientPackageName(unknownClient);
    }).toThrow(new Error(`Client '${unknownClient}' is either deprecated or newly added.`));
  });
});
