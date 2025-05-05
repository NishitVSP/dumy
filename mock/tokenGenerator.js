import { getScripMasterData } from './dataHandler.js';

export function getOptionTokens(indexName) {
  const scripMasterData = getScripMasterData();

  if (!scripMasterData[indexName]) {
    console.error(`Index ${indexName} not found in script master data`);
    return [];
  }

  const indexData = scripMasterData[indexName];
  const tokens = [];
  const missingExpiries = [];

  const exchange = indexName === 'BANKEX' || indexName === 'SENSEX' ? 'BSE_FO' : 'NSE_FO';

  const sortedExpiries = [...indexData.expiries].sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1, a.day);
    const dateB = new Date(b.year, b.month - 1, b.day);
    return dateA.getTime() - dateB.getTime();
  });

  sortedExpiries.forEach((expiry, idx) => {
    const month = expiry.month.toString().padStart(2, '0');
    const day = expiry.day.toString().padStart(2, '0');
    const expiryKey = `${day}-${month}-${expiry.year}`;
    const expiryData = indexData[expiryKey];

    if (!expiryData || !expiryData.ce || !expiryData.pe) {
      missingExpiries.push(expiryKey);
      return;
    }

    const allStrikes = Object.keys(expiryData.ce)
      .map(Number)
      .sort((a, b) => a - b);

    if (allStrikes.length === 0) {
      console.warn(`No strikes found for ${indexName} at expiry ${expiryKey}`);
      return;
    }

    const middleIndex = Math.floor(allStrikes.length / 2);
    const strikesToGet = idx === 0 ? 40 : 20;
    const startIdx = Math.max(0, middleIndex - strikesToGet);
    const endIdx = Math.min(allStrikes.length - 1, middleIndex + strikesToGet);
    const selectedStrikes = allStrikes.slice(startIdx, endIdx + 1);

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
}
