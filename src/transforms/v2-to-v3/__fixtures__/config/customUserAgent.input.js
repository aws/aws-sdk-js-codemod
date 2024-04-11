import AWS from "aws-sdk";

const config = new AWS.Config({
  customUserAgent: "MyApp/1.0.0"
});