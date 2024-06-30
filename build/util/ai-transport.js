"use strict";
// import Transport = require("winston-transport");
// import { TelemetryClient } from "applicationinsights";
// import appInsights = require("applicationinsights");
// import { SeverityLevel } from "applicationinsights/out/Declarations/Contracts";
// declare interface infoObject {
//   level: string;
//   message: string;
//   [key: string]: unknown;
// }
// declare interface ApplicationInsightTransportOptions
//   extends Transport.TransportStreamOptions {
//   key?: string;
//   client?: TelemetryClient;
//   appInsights?: {
//     defaultClient: TelemetryClient;
//   };
// }
// const winstonLevelsMap: { [level: string]: SeverityLevel } = {
//   emerg: SeverityLevel.Critical,
//   crit: SeverityLevel.Critical,
//   error: SeverityLevel.Error,
//   warn: SeverityLevel.Warning,
//   warning: SeverityLevel.Warning,
//   notice: SeverityLevel.Information,
//   info: SeverityLevel.Information,
//   verbose: SeverityLevel.Verbose,
//   debug: SeverityLevel.Verbose,
//   silly: SeverityLevel.Verbose,
// };
// /**
//  *
//  * @param winstonLevel
//  */
// function getAiLevel(winstonLevel: string): SeverityLevel {
//   return winstonLevel in winstonLevelsMap
//     ? winstonLevelsMap[winstonLevel]
//     : SeverityLevel.Information;
// }
// export class AiTransport extends Transport {
//   private _client: TelemetryClient;
//   private _silent: boolean;
//   private _level: string;
//   private _handleExceptions: boolean;
//   constructor(options: ApplicationInsightTransportOptions = {}) {
//     super(options);
//     if (options.client) {
//       this._client = options.client;
//     } else if (options.appInsights) {
//       this._client = options.appInsights.defaultClient;
//     } else {
//       appInsights
//         .setup(options.key)
//         .setAutoDependencyCorrelation(true)
//         .setAutoCollectRequests(true)
//         .setAutoCollectPerformance(true, true)
//         .setAutoCollectExceptions(true)
//         .setAutoCollectDependencies(true)
//         .setAutoCollectConsole(true, true)
//         .setUseDiskRetryCaching(true)
//         .setSendLiveMetrics(false)
//         .start();
//       this._client = appInsights.defaultClient;
//     }
//     this._silent = options.silent || false;
//     this._level = options.level || "info";
//     this._handleExceptions = options.handleExceptions || false;
//     if (!this._client) {
//       throw new Error("No Application Insights client instance found");
//     }
//   }
//   log(info: infoObject, callback: () => void) {
//     const level = info.level;
//     const message = info.message;
//     const meta = { ...info };
//     const aiLevel = getAiLevel(level);
//     this._client.trackTrace({
//       message: message,
//       severity: aiLevel,
//       properties: meta,
//     });
//     callback();
//   }
// }
