import { parentPort, workerData } from 'worker_threads';
import { generateRandomFluctuation } from '../mock/fluctuationSimulator.js';

// Simulate a task for generating fluctuations
function performTask(tokens) {
  return tokens.map(token => {
    const fluctuationData = generateRandomFluctuation(token.strike);
    return {
      ...token,
      fluctuationData
    };
  });
}

// Continuously perform the task at regular intervals
setInterval(() => {
  const result = performTask(workerData.tokens).map(token => ({
    workerId: workerData.workerId,
    exchange: token.exchange,
    tokenNumber: token.tokenNumber,
    value: token.fluctuationData.value,
    fluctuationPercent: token.fluctuationData.fluctuationPercent,
    timestamp: new Date().toISOString()
  }));
  parentPort.postMessage(result);
}, 400); 