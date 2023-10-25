import AWS from "aws-sdk";

const config = new AWS.Config({
  credentials: {
    accessKeyId: "AKID",
    secretAccessKey: "SECRET"
  }
});