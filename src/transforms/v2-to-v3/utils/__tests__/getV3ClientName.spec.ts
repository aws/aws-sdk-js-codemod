import { CLIENT_NAMES_MAP } from "../config";
import { getV3ClientName } from "../getV3ClientName";

describe(getV3ClientName.name, () => {
  it.each(Object.entries(CLIENT_NAMES_MAP))("getV3ClientName('%s') === '%s'", (input, output) => {
    expect(getV3ClientName(input)).toBe(output);
  });

  it.each(["ImportExport", "MobileAnalytics", "SimpleDB"])(
    "throws for deprecated client '%s'",
    (deprecatedClient) => {
      expect(() => {
        getV3ClientName(deprecatedClient);
      }).toThrow(new Error(`Client '${deprecatedClient}' is either deprecated or newly added.`));
    }
  );

  it.each(["UNDEFINED", "NULL", "UNKNOWN"])("throws for unknown client '%s'", (unknownClient) => {
    expect(() => {
      getV3ClientName(unknownClient);
    }).toThrow(new Error(`Client '${unknownClient}' is either deprecated or newly added.`));
  });
});
