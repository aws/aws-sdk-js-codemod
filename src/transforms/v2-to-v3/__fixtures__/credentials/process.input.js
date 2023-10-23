import AWS from "aws-sdk";

new AWS.ProcessCredentials({ profile: "profile-name" });