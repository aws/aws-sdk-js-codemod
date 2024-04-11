import AWS from "aws-sdk";

const config = {
  // The credentials in JS SDK v3 accepts providers.
  credentials: () => Promise.resolve({
    accessKeyId: "AKID",
    secretAccessKey: "SECRET"
  })
};