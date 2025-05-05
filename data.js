// Base values for the 6 indexes (realistic approximations or your own values)
const indexes = {
  'Bank Nifty': 50000,
  'Nifty': 22500,
  'Fin Nifty': 20500,
  'Midcap Nifty': 46000,
  'Bankex': 54000,
  'Sensex': 74000
};


// Modify the generateMockValue function to create sinusoidal data
function generateMockValue(base, name) {
  const fluctuation = (Math.random() - 0.5) * 0.02; // Random fluctuation between -5% and +5%
  const value = base * (1 + fluctuation);
  return {
    name,
    value: parseFloat(value.toFixed(2)),
    fluctuationPercent: parseFloat((fluctuation * 100).toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

// Function to continuously generate mock data
function startMockDataGeneration() {
  const samplesPerSecond = 3;
  const interval = 1000 / samplesPerSecond; // Interval in milliseconds

  setInterval(() => {
    Object.keys(indexes).forEach(name => {
      const basePrice = indexes[name];
      for (let i = 0; i < samplesPerSecond; i++) {
        const mock = generateMockValue(basePrice, name);
        console.log(`[${mock.timestamp}] ${mock.name}: ₹${mock.value} (${mock.fluctuationPercent}%)`);
      }
    });
  }, 1000);
}

startMockDataGeneration();