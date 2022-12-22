const fs = require('fs')
const { compiler } = require('./compiler')

fs.readFile('./input.txt', 'utf-8', (err, data) => {
  compiler(data)
})
