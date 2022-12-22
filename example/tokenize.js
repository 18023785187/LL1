
class Token {
  constructor(type, value, line, start, end) {
    this.type = type
    this.value = value
    this.line = line
    this.start = start
    this.end = end
  }
}

const tokenType = {
  Initial: 'Initial',
  literal: 'literal',
  point: 'point',
  leftBracket: 'leftBracket',
  rightBracket: 'rightBracket',
  plus: 'plus',
  minus: 'minus',
  multiply: 'multiply',
  divide: 'divide'
}

module.exports = { Token, tokenType }
