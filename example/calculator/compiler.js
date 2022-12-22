/**
 * 10进制四则运算器，可加减乘除，可括号优先级，可负数。
 */
const { LexerParser } = require('./LexerParser');
const { SyntacticParser } = require('../SyntacticParser');
const { startSymbol, predictSet, constructor, AstChildrenProperty, AstType } = require('./grammar');

function compiler(sentence) {
  const plus = (num1, num2) => num1 + num2
  const minus = (num1, num2) => num1 - num2
  const multiply = (num1, num2) => num1 * num2
  const divide = (num1, num2) => num1 / num2

  const alu = []

  const lexerParser = new LexerParser();
  const syntacticParser = new SyntacticParser(startSymbol, predictSet, constructor);

  const tokens = lexerParser.parse(sentence)
  const ast = syntacticParser.parse(tokens)

  const stack = []
  stack.push(ast)
  while (stack.length) {
    const node = stack.pop()

    switch (node.type) {
      case AstType.Identifier:
        alu.push(node.value)
        break;
      case AstType.UnaryExpression:
        switch (node.operator) {
          case '+': alu.push(plus, 0); break
          case '-': alu.push(minus, 0); break
        }
        break
      case AstType.BinaryExpression:
        switch (node.operator) {
          case '+': alu.push(plus); break
          case '-': alu.push(minus); break
          case '*': alu.push(multiply); break
          case '/': alu.push(divide); break
        }
        break;
    }

    const childrenProperty = AstChildrenProperty[node.type]

    if (Array.isArray(childrenProperty)) {
      for (let i = childrenProperty.length - 1; i >= 0; --i) {
        if (node[childrenProperty[i]]) {
          stack.push(node[childrenProperty[i]])
        }
      }
    } else {
      if (node[childrenProperty]) {
        stack.push(node[childrenProperty])
      }
    }
  }

  let result = 0
  const set = new Set()
  const isFunc = (val) => typeof val === 'function'
  const isNum = (val) => typeof val === 'number'
  if (alu.length === 1) {
    result = alu[0]
  } else {
    for (let i = alu.length - 1; i >= 0; --i) {
      if (isFunc(alu[i])) {
        const func = alu[i]
        const args = []
        for (let j = i + 1; j < alu.length; ++j) {
          if (isNum(alu[j]) && !set.has(j)) {
            set.add(j)
            args.push(alu[j])
            if (args.length === 2) {
              result = alu[i] = func.apply(null, args)
              break
            }
          }
        }
      }
    }
  }

  console.log(`Compile successfully, result:`, result)
}

module.exports = { compiler };
