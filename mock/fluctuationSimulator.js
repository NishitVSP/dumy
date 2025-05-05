export function generateRandomFluctuation(base) {
  const fluctuation = (Math.random() - 0.5) * 0.10;
  const value = base * (1 + fluctuation);
  return {
    value: parseFloat(value.toFixed(2)),
    fluctuationPercent: parseFloat((fluctuation * 100).toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

export function simulateDataStream(tokens, interval) {
  tokens.forEach(token => {
    setInterval(() => {
      const fluctuationData = generateRandomFluctuation(token.strike);
      console.log(`Exchange: ${token.exchange} ,Type : ${token.type}, Token: ${token.tokenNumber}, Strike: ${token.strike}, Fluctuation:`, fluctuationData);
    }, interval);
  });
}
