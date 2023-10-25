import AWS from "aws-sdk";

const config = new AWS.Config({
  endpointDiscoveryEnabled: true
});