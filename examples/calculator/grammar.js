const { makeLL1 } = require('../../src/index');

const AstType = {
  'Identifier': 'Identifier',
  'PlusExpression': 'PlusExpression',
  'MinusExpression': 'MinusExpression',
  'MultiplyExpression': 'MultiplyExpression',
  'DivideExpression': 'DivideExpression',
  'UnaryExpression': 'UnaryExpression',
  'BinaryExpression': 'BinaryExpression'
}
const AstChildrenProperty = {
  'UnaryExpression': ['argument'],
  'BinaryExpression': ['left', 'right']
}

const grammars =
  [
    'Sentence       -> AddExpression',
    'AddExpression  -> MulExpression AddExpression1',
    'AddExpression1 -> Operator1 MulExpression $binaryExpression AddExpression1 | null',
    'MulExpression  -> Literal MulExpression1',
    'MulExpression1 -> Operator2 Literal $binaryExpression MulExpression1 | null',
    'Literal        -> leftBracket AddExpression rightBracket | literal | Operator1 literal $unaryExpression',
    'Operator1      -> plus | minus',
    'Operator2      -> multiply | divide'
  ];
const terminalSymbols = 'leftBracket|rightBracket|literal|plus|minus|multiply|divide'.split('|');

const ll1 = makeLL1(grammars, terminalSymbols);

const literal = (raw, line, start, end) => {
  return {
    type: AstType['Identifier'],
    raw,
    value: Number(raw),
    line,
    start,
    end
  };
};

const plus = (operator, line, start, end) => {
  return {
    type: AstType['PlusExpression'],
    operator,
    line,
    start,
    end
  };
};

const minus = (operator, line, start, end) => {
  return {
    type: AstType['MinusExpression'],
    operator,
    line,
    start,
    end
  };
};

const multiply = (operator, line, start, end) => {
  return {
    type: AstType['MultiplyExpression'],
    operator,
    line,
    start,
    end
  };
};

const divide = (operator, line, start, end) => {
  return {
    type: AstType['DivideExpression'],
    operator,
    line,
    start,
    end
  };
};

const $unaryExpression = (astList) => {
  const startIdx = astList.length - 2;
  const operator = astList[startIdx];
  const literal = astList[startIdx + 1];
  const ast = {
    type: AstType['UnaryExpression'],
    line: operator.line,
    start: operator.start,
    end: literal.end,
    operator: operator.operator,
    argument: literal
  };
  astList.splice(startIdx, 2, ast);
};

const $binaryExpression = (astList) => {
  const centerIdx = astList.length - 2;
  const operator = astList[centerIdx];
  const left = astList[centerIdx - 1];
  const right = astList[centerIdx + 1];
  const ast = {
    type: AstType['BinaryExpression'],
    line: left.line,
    start: left.start,
    end: right.end,
    operator: operator.operator,
    left: left,
    right: right
  };
  astList.splice(centerIdx - 1, 3, ast);
};

module.exports = {
  startSymbol: ll1.startSymbol,
  predictSet: ll1.predictSet,
  AstType,
  AstChildrenProperty,
  constructor: {
    literal,
    plus,
    minus,
    multiply,
    divide,
    $unaryExpression,
    $binaryExpression
  }
};