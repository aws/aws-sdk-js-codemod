import AWS from "aws-sdk";

new AWS.SharedIniFileCredentials({ profile: "profile-name" });