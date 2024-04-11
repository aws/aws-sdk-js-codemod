import AWS from "aws-sdk";

const config = new AWS.Config({
  credentialProvider: () => Promise.resolve({
    accessKeyId: "AKID",
    secretAccessKey: "SECRET"
  })
});