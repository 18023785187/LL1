const fs = require('fs');
const { compiler } = require('./compiler');

fs.readFile('./input.h', 'utf-8', (err, data) => {
  console.log(
`\x1b[32;1m小型声明语言示例 ↓↓↓↓↓↓↓↓↓\x1b[0m
print:`
    );
  compiler(data);
});
