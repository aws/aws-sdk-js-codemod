const config = {
  // The key credentialProvider is renamed to credentials.
  // The credentials in JS SDK v3 accepts providers.
  credentials: () => Promise.resolve({
    accessKeyId: "AKID",
    secretAccessKey: "SECRET"
  })
};