import { AccessAnalyzer } from "@aws-sdk/client-accessanalyzer";
import { ACM } from "@aws-sdk/client-acm";
import { ApplicationDiscoveryService } from "@aws-sdk/client-application-discovery-service";

let accessAnalyzerClient: AccessAnalyzer;
let discoveryClient: ApplicationDiscoveryService;
let acmClient: ACM;