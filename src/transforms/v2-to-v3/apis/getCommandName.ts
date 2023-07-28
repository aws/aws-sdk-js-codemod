// Returns the command name for a given API name
// Example input `getObject` returns `GetObjectCommand`
export const getCommandName = (apiName: string): string =>
  `${apiName[0].toUpperCase()}${apiName.slice(1)}Command`;
