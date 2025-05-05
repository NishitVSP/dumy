import fs from 'fs';
import path from 'path';

const __dirname = 'C:/Users/Lenovo/Desktop/programming/Rough';

export function getScripMasterData() {
  const dataPath = path.resolve(__dirname, 'reference/scripMasterData.json');
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}
