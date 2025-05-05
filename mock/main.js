import { getOptionTokens } from './tokenGenerator.js';
import { simulateDataStream } from './fluctuationSimulator.js';

const indexes = ['BANKNIFTY', 'NIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'BANKEX', 'SENSEX'];

const nseTokens = [];
const bseTokens = [];

indexes.forEach(indexName => {
  const tokens = getOptionTokens(indexName);
  tokens.forEach(token => {
    if (token.exchange === 'NSE_FO') {
      nseTokens.push(token);
    } else if (token.exchange === 'BSE_FO') {
      bseTokens.push(token);
    }
  });
});

const allTokens = nseTokens.concat(bseTokens);
const testTokens = allTokens.slice(0, 2);

simulateDataStream(testTokens, 1000);
