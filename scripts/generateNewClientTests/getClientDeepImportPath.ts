export const getClientDeepImportPath = (clientName: string) =>
  `aws-sdk/clients/${clientName.toLowerCase()}`;
