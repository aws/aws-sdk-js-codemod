export const getV3ClientTypeName = (v2ClientTypeName: string) => {
  if (v2ClientTypeName.endsWith("Input")) {
    return v2ClientTypeName.replace(/Input$/, "CommandInput");
  }

  if (v2ClientTypeName.endsWith("Output")) {
    return v2ClientTypeName.replace(/Output$/, "CommandOutput");
  }

  return undefined;
};
