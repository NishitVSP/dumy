import fs from 'fs';
import path from 'path';


const __dirname = 'C:/Users/Lenovo/Desktop/programming/Rough';

// Function to generate random fluctuation
function generateRandomFluctuation(base) {
  const fluctuation = (Math.random() - 0.5) * 0.10; // Random fluctuation between -5% and +5%
  const value = base * (1 + fluctuation);
  return {
    value: parseFloat(value.toFixed(2)),
    fluctuationPercent: parseFloat((fluctuation * 100).toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

// Function to retrieve option tokens
function getOptionTokens(indexName) {
  try {
    // Read the script master data
    const dataPath = path.resolve(__dirname, 'reference/scripMasterData.json');
    const scripMasterData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    if (!scripMasterData[indexName]) {
      console.error(`Index ${indexName} not found in script master data`);
      return [];
    }

    const indexData = scripMasterData[indexName];
    const tokens = [];
    const missingExpiries = [];

    // Determine exchange based on index name
    const exchange = indexName === 'BANKEX' || indexName === 'SENSEX' ? 'BSE_FO' : 'NSE_FO';

    // Sort expiries by date (closest first)
    const sortedExpiries = [...indexData.expiries].sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1, a.day);
      const dateB = new Date(b.year, b.month - 1, b.day);
      return dateA.getTime() - dateB.getTime();
    });

    // Process each expiry
    sortedExpiries.forEach((expiry, idx) => {
      // Format month with leading zero if needed
      const month = expiry.month.toString().padStart(2, '0');
      const day = expiry.day.toString().padStart(2, '0');
      const expiryKey = `${day}-${month}-${expiry.year}`;
      const expiryData = indexData[expiryKey];

      if (!expiryData || !expiryData.ce || !expiryData.pe) {
        // Collect missing expiry rather than logging each one
        missingExpiries.push(expiryKey);
        return;
      }

      // Get all strikes for CE
      const allStrikes = Object.keys(expiryData.ce)
        .map(Number)
        .sort((a, b) => a - b);

      if (allStrikes.length === 0) {
        console.warn(`No strikes found for ${indexName} at expiry ${expiryKey}`);
        return;
      }

      // Find the middle strike (center point of available strikes)
      const middleIndex = Math.floor(allStrikes.length / 2);

      // Determine how many strikes to get on each side based on whether this is the closest expiry
      const strikesToGet = idx === 0 ? 40 : 20;

      // Calculate the range of indices to extract
      const startIdx = Math.max(0, middleIndex - strikesToGet);
      const endIdx = Math.min(allStrikes.length - 1, middleIndex + strikesToGet);

      // Get the subset of strikes
      const selectedStrikes = allStrikes.slice(startIdx, endIdx + 1);

      // Extract CE tokens
      selectedStrikes.forEach((strike) => {
        const strikeStr = strike.toString();
        if (expiryData.ce[strikeStr]) {
          tokens.push({
            exchange,
            tokenNumber: expiryData.ce[strikeStr].token,
            strike: strike,
            type: 'CE'
          });
        }
      });

      // Extract PE tokens
      selectedStrikes.forEach((strike) => {
        const strikeStr = strike.toString();
        if (expiryData.pe[strikeStr]) {
          tokens.push({
            exchange,
            tokenNumber: expiryData.pe[strikeStr].token,
            strike: strike,
            type: 'PE'
          });
        }
      });
    });

    return tokens;
  } catch (error) {
    console.error(`Error getting tokens for ${indexName}:`, error);
    return [];
  }
}

// startTokenMockDataGeneration();

// Define the indexes to process
const indexes = ['BANKNIFTY', 'NIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'BANKEX', 'SENSEX'];

// Initialize lists to store tokens for NSE_FO and BSE_FO
const nseTokens = [];
const bseTokens = [];

// Process each index and store tokens in the respective list
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

// // Log the results
// console.log('NSE_FO Tokens:', nseTokens);
// console.log('BSE_FO Tokens:', bseTokens);

// Concatenate the two lists
const allTokens = nseTokens.concat(bseTokens);

// Select the first two tokens for testing
const testTokens = allTokens.slice(0, 2);
// Function to simulate data stream for a list of tokens
function simulateDataStream(tokens, interval) {
  tokens.forEach(token => {
    setInterval(() => {
      const fluctuationData = generateRandomFluctuation(token.strike);
      console.log(`Exchange: ${token.exchange} ,Type : ${token.type}, Token: ${token.tokenNumber}, Strike: ${token.strike}, Fluctuation:`, fluctuationData);
    }, interval);
  });
}

// Start the data stream for all tokens
simulateDataStream(testTokens, 1000); // 1000 ms = 1 second