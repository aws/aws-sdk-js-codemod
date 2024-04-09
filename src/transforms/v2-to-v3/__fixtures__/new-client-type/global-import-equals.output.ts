import AWS_client_accessanalyzer = require("@aws-sdk/client-accessanalyzer");
import AccessAnalyzer = AWS_client_accessanalyzer.AccessAnalyzer;
import AWS_client_acm = require("@aws-sdk/client-acm");
import ACM = AWS_client_acm.ACM;
import AWS_client_application_discovery_service = require("@aws-sdk/client-application-discovery-service");
import ApplicationDiscoveryService = AWS_client_application_discovery_service.ApplicationDiscoveryService;

let accessAnalyzerClient: AccessAnalyzer;
let discoveryClient: ApplicationDiscoveryService;
let acmClient: ACM;