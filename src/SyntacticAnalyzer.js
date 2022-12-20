const { EMPTY_CHAIN, $ } = require('./contants')

/**
  E -> T E'
  E' -> + T E' | null
  T -> F T'
  T' -> * F T' | null
  F -> ( E ) | id

  id + id * id
 */
class SyntacticAnalyzer {
  constructor(startSymbol, predictSet) {
    this.startSymbol = startSymbol
    this.predictSet = predictSet
    this.stack = []
  }

  /**
   * 由于缺少词法分析器我们约定使用字符串语句进行解析，以空格为分隔符，只能使用产生预测分析表的终止符作为表达式语句
   */
  parser(expression) {
    expression = expression.split(' ')
    let pos = 0

    this.stack.push(this.startSymbol)

    while (this.stack.length) {
      const chain = pos < expression.length ? expression[pos] : $

      if (!this.predictSet.has(chain)) {
        expression[pos] = "\x1b[31;2;4m" + expression[pos] + "\x1b[0m"
        throw new SyntaxError(`Unexpected token '${expression[pos]}', expression is ${expression.join(' ')}`)
      }

      const rules = this.predictSet.get(chain)
      const left = this.stack.pop()
      if (!rules.has(left)) {
        pos = pos < expression.length ? pos : pos - 1
        expression[pos] = "\x1b[31;2;4m" + expression[pos] + "\x1b[0m"
        throw new SyntaxError(`Unexpected token '${expression[pos]}', expression is ${expression.join(' ')}`)
      }
      const exp = rules.get(left)

      for (let i = exp.length - 1; i >= 0; --i)
        exp[i] !== EMPTY_CHAIN && this.stack.push(exp[i])

      if (this.stack[this.stack.length - 1] === chain) {
        this.stack.pop()
        pos++
      }
    }

    console.log(`compiled by ${expression.join(' ')}`)
  }
}

module.exports = { SyntacticAnalyzer }
