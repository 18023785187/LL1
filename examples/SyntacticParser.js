const { EMPTY_CHAIN, $ } = require('../src/index')
const { Scanner } = require("./Scanner")
const { Token } = require('./Token')
const Error = require('./Error');

class SyntacticParser {
  constructor(startSymbol, predictSet, constructor) {
    this.startSymbol = startSymbol
    this.predictSet = predictSet
    this.constructor = constructor
  }

  parse(tokens) {
    const astList = []
    const stack = []
    stack.push(this.startSymbol)

    tokens.push(new Token($))
    const scanner = new Scanner(tokens)

    let token
    while (stack.length) {
      token = scanner.peek()
      const terminalSymbol = token.type
      // 抛出意外的终结符错误
      if (!this.predictSet.has(terminalSymbol)) {
        const message = `Unexpected token '${"\x1b[31;2;4m" + token.value + "\x1b[0m"}'`;
        Error.syntaxError(message, {
          message: '',
          start: token.start,
          end: token.end
        });
      }

      const expressionMap = this.predictSet.get(terminalSymbol)
      const left = stack.pop()
      if(left[0] === $) {
        this.constructor[left]?.(astList)
        continue
      } else if(left === token.type) {
        const child = this.constructor[token.type]?.(token.value, token.line, token.start, token.end)
        if(child) astList.push(child)
        scanner.read()
        continue
      }
      // 该终结符找不到对应产生式，说明文法不适用当前表达式，抛出语法错误
      if (!expressionMap.has(left)) {
        const message = `Unexpected token '${"\x1b[31;2;4m" + token.value + "\x1b[0m"}'`;
        Error.syntaxError(message, {
          message: '',
          line: token.line,
          start: token.start
        });
      }

      const right = expressionMap.get(left)
      if (right[0] === EMPTY_CHAIN) continue
      for (let i = right.length - 1; i >= 0; --i)
        stack.push(right[i])
    }

    return {
      type: 'Program',
      line: 1,
      start: 0,
      end: astList.length ? astList[astList.length - 1].end : 0,
      body: astList
    }
  }
}

module.exports = { SyntacticParser }
