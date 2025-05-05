import { Worker } from 'worker_threads';
import path from 'path';
import os from 'os';
import { getOptionTokens } from '../mock/tokenGenerator.js';

const __dirname = 'C:/Users/Lenovo/Desktop/programming/Rough/workers';

// Get all tokens
const allTokens = getOptionTokens('BANKNIFTY').concat(getOptionTokens('NIFTY'), getOptionTokens('FINNIFTY'), getOptionTokens('MIDCPNIFTY'), getOptionTokens('BANKEX'), getOptionTokens('SENSEX')); 

// Determine the number of CPU cores
const numCores = os.cpus().length;

// Calculate the number of tokens each worker should process
const tokensPerWorker = Math.ceil(allTokens.length / (numCores - 1));

function runWorker(workerData, workerId) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, './workerTask.js'), {
      workerData: { ...workerData, workerId }
    });

    worker.on('message', (result) => {
      result.forEach(token => {
        console.log(`Worker ${token.workerId} processed: ${token.exchange} | ${token.tokenNumber} | ${token.value} | ${token.fluctuationPercent} | ${token.timestamp}`);
      });
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

async function run() {
  const promises = [];
  for (let i = 0; i < numCores - 1; i++) {
    const start = i * tokensPerWorker;
    const end = start + tokensPerWorker;
    const workerTokens = allTokens.slice(start, end);
    if (workerTokens.length > 0) {
      promises.push(runWorker({ tokens: workerTokens }, i + 1));
    }
  }

  try {
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
}

run();