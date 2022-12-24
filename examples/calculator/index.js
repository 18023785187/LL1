const fs = require('fs');
const { compiler } = require('./compiler');

fs.readFile('./input.txt', 'utf-8', (err, data) => {
  console.log('\x1b[32;1m四则计算器示例 ↓↓↓↓↓↓↓↓↓\x1b[0m');
  compiler(data);
});
