export const getDefaultLocalName = (localNameSuffix: string) =>
  `AWS_${localNameSuffix.replace(".", "")}`;
