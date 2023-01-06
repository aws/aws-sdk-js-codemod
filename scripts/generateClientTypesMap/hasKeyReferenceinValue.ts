/**
 * Returns true if value contains reference to key.
 *
 * Reference is defined as key name inside brackets in Array/Record type
 * i.e. `Array<key>` or `Record<string, key>` for `key`.
 */
export const hasKeyReferenceInValue = (key: string, value: string) =>
  value.includes(`Array<${key}>`) || value.includes(`Record<string, ${key}>`);
