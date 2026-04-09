import { startEventPollingWorker } from "./eventPollingWorker.js";
import { startSettlementWorker } from "./settlementWorker.js";

export const startWorkers = () => {
  startEventPollingWorker();
  startSettlementWorker();
};
