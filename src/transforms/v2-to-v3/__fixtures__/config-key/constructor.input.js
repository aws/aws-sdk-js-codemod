import AWS from "aws-sdk";

AWS.config.update({ region: "us-west-2" });

const config = new AWS.Config();