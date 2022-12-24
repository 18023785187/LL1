
class Token {
  constructor(type, value, line, start, end) {
    this.type = type
    this.value = value
    this.line = line
    this.start = start
    this.end = end
  }
}

module.exports = { Token }
