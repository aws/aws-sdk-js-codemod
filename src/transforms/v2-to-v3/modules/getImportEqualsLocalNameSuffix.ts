export const getImportEqualsLocalNameSuffix = (v2ClientName: string, v3ClientPackageName: string) =>
  v3ClientPackageName.startsWith("@aws-sdk/client-")
    ? v2ClientName
    : v3ClientPackageName.substring(9).replace(/-/g, "_");
