const express = require('express');
const app = express();
const PORT = 3000;

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
function generateMockValue(base, name, timeIndex) {
  const amplitude = 0.05; // 5% amplitude
  const frequency = (2 * Math.PI) / 20; // Adjust frequency for a full cycle over 20 samples
  const fluctuation = amplitude * Math.sin(frequency * timeIndex);
  const value = base * (1 + fluctuation);
  return {
    name,
    value: parseFloat(value.toFixed(2)),
    fluctuationPercent: parseFloat((fluctuation * 100).toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

// Route: /mock-data?duration=2
app.get('/mock-data', (req, res) => {
  const duration = parseInt(req.query.duration);

  if (isNaN(duration) || duration <= 0) {
    return res.status(400).json({ error: "Invalid duration" });
  }

  const samplesPerSecond = 3;
  const totalSamples = samplesPerSecond * duration;
  const result = [];

  Object.keys(indexes).forEach(name => {
    const basePrice = indexes[name];
    for (let i = 0; i < totalSamples; i++) {
      const mock = generateMockValue(basePrice, name, i);
      result.push(mock);
      console.log(`[${mock.timestamp}] ${mock.name}: ₹${mock.value} (${mock.fluctuationPercent}%)`);
    }
  });

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});