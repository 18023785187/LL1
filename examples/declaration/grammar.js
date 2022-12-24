const { makeLL1 } = require('../../src/index');

const AstType = {
  'VariableDeclaration': 'VariableDeclaration',
  'VariableDeclarator': 'VariableDeclarator',
  'Identifier': 'Identifier',
  'Literal': 'Literal',
  'EqualExpression': 'EqualExpression',
  'PlusExpression': 'PlusExpression',
  'MinusExpression': 'MinusExpression',
  'MultiplyExpression': 'MultiplyExpression',
  'DivideExpression': 'DivideExpression',
  'UnaryExpression': 'UnaryExpression',
  'BinaryExpression': 'BinaryExpression',
  'PrintCallExpression': 'PrintCallExpression',
  'ExpressionStatement': 'ExpressionStatement',
  'AssignmentExpression': 'AssignmentExpression'
};

const expressions =
  [
    `Sentence       ->  Defined |
                        Print | 
                        Function | 
                        null`,
    `Sentence'      ->  $declaration Semicolon Sentence |
                        equal Expression $declarationInit Semicolon Sentence |
                        Identifier $expressionStatement equal Expression $assignment Semicolon Sentence`,
    'Semicolon      ->  semicolon Semicolon`',
    'Semicolon`     ->  semicolon Semicolon` | null',
    'Expression     ->  AddExpression',
    'AddExpression  ->  MulExpression AddExpression1',
    'AddExpression1 ->  Operator1 MulExpression $binaryExpression AddExpression1 | null',
    'MulExpression  ->  Literal MulExpression1',
    'MulExpression1 ->  Operator2 Literal $binaryExpression MulExpression1 | null',
    'Identifier     ->  identifier',
    'Literal        ->  leftBracket AddExpression rightBracket | literal | identifier | Operator1 literal $unaryExpression',
    'Operator1      ->  plus | minus',
    'Operator2      ->  multiply | divide',
    "Defined        ->  defined Identifier Defined'",
    `Defined'       ->  $declaration Semicolon Sentence |
                        equal Expression $declarationInit Semicolon Sentence |
                        Identifier $expressionStatement equal Expression $assignment Semicolon Sentence`,
    'Print          ->  print leftBracket Expression rightBracket $printArguments Semicolon Sentence',
    "Function       ->  function Identifier leftBracket Arguments rightBracket begin Sentence Function'",
    "Function'      ->  end Semicolon Sentence | return end Semicolon Sentence",
    "Arguments      ->  Literal Arguments'",
    "Arguments'     ->  null | comma Literal"
  ];
const terminalSymbols = 'defined|identifier|equal|semicolon|leftBracket|rightBracket|literal|plus|minus|multiply|divide|print|function|begin|end|return|comma'.split('|');

const ll1 = makeLL1(expressions, terminalSymbols);

const defined = (kind, line, start, end) => {
  return {
    type: AstType['VariableDeclaration'],
    line,
    start,
    end,
    declarations: [],
    kind
  };
};

const identifier = (name, line, start, end) => {
  return {
    type: AstType['Identifier'],
    line,
    start,
    end,
    name
  };
};

const literal = (raw, line, start, end) => {
  return {
    type: AstType['Literal'],
    line,
    start,
    end,
    value: Number(raw),
    raw
  };
};

const equal = (operator, line, start, end) => {
  return {
    type: AstType['EqualExpression'],
    line,
    start,
    end,
    operator
  };
};

const plus = (operator, line, start, end) => {
  return {
    type: AstType['PlusExpression'],
    line,
    start,
    end,
    operator
  };
};

const minus = (operator, line, start, end) => {
  return {
    type: AstType['MinusExpression'],
    line,
    start,
    end,
    operator
  };
};

const multiply = (operator, line, start, end) => {
  return {
    type: AstType['MultiplyExpression'],
    line,
    start,
    end,
    operator
  };
};

const divide = (operator, line, start, end) => {
  return {
    type: AstType['DivideExpression'],
    line,
    start,
    end,
    operator
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
    left: left,
    operator: operator.operator,
    right: right
  };
  astList.splice(centerIdx - 1, 3, ast);
};

const $declaration = (astList) => {
  const startIdx = astList.length - 2;
  const declarator = astList[startIdx];
  const identifier = astList[startIdx + 1];
  const ast = createVariableDeclarator(
    declarator.line,
    declarator.start,
    identifier.end,
    identifier
  );
  declarator.declarations.push(ast);
  astList.splice(startIdx + 1, 1);
};

const $declarationInit = (astList) => {
  const startIdx = astList.length - 4;
  const declarator = astList[startIdx];
  const identifier = astList[startIdx + 1];
  const expression = astList[startIdx + 3];
  const ast = createVariableDeclarator(
    declarator.line,
    declarator.start,
    expression.end,
    identifier,
    expression
  );
  declarator.declarations.push(ast);
  astList.splice(startIdx + 1, 3);
};

const $expressionStatement = (astList) => {
  const startIdx = astList.length - 1
  const identifier = astList[startIdx];
  const ast = {
    type: AstType["ExpressionStatement"],
    line: identifier.line,
    start: identifier.start,
    end: identifier.end,
    expression: identifier
  };
  astList.splice(startIdx, 1, ast);
};

const $assignment = (astList) => {
  const startIdx = astList.length - 3;
  const statement = astList[startIdx];
  const operator = astList[startIdx + 1]
  const expression = astList[startIdx + 2];
  const ast = {
    type: AstType["AssignmentExpression"],
    line: statement.line,
    start: statement.start,
    end: expression.end,
    operator: operator.operator,
    left: statement.expression,
    right: expression
  };
  statement.expression = ast;
  astList.splice(startIdx + 1, 2);
};

const print = (_, line, start, end) => {
  return {
    type: AstType['PrintCallExpression'],
    line,
    start,
    end,
    arguments: []
  }
}

const $printArguments = (astList) => {
  const startIdx = astList.length - 2
  const print = astList[startIdx]
  const args = astList[startIdx + 1]
  print.arguments.push(args)
  astList.splice(startIdx + 1, 1)
}

// creator AST
const createVariableDeclarator = (
  line, start, end, id, init = null
) => ({
  type: AstType['VariableDeclarator'],
  line,
  start,
  end,
  id,
  init,
});

module.exports = {
  startSymbol: ll1.startSymbol,
  predictSet: ll1.predictSet,
  AstType,
  constructor: {
    defined,
    identifier,
    literal,
    equal,
    plus,
    minus,
    multiply,
    divide,
    $unaryExpression,
    $binaryExpression,
    $declaration,
    $declarationInit,
    $expressionStatement,
    $assignment,
    print,
    $printArguments
  }
};