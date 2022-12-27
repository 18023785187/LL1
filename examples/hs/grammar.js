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
  'ExpressionStatement': 'ExpressionStatement',
  'AssignmentExpression': 'AssignmentExpression',
  'FunctionExpression': 'FunctionExpression',
  "BlockStatement": "BlockStatement",
  "ReturnStatement": "ReturnStatement",
  "CallExpression": "CallExpression",
  'IfStatement': 'IfStatement'
};

const grammars =
[
  `Sentence         ->  SingleStatement Semicolon Sentence | null`,
  'SingleStatement  ->  Defined | Function | Assignment | Literal | Block | Condition',
  // 分号
  'Semicolon        ->  semicolon Semicolon`',
  'Semicolon`       ->  semicolon Semicolon` | null',
  // 算术运算
  'Expression       ->  AddExpression',
  'AddExpression    ->  MulExpression AddExpression1',
  'AddExpression1   ->  Operator1 MulExpression $binaryExpression AddExpression1 | null',
  `MulExpression    ->  Identifier MulExpression' | Literal MulExpression1`,
  `MulExpression'   ->  MulExpression1 | CallSuffix MulExpression1 | null`,
  'MulExpression1   ->  Operator2 MulExpression2 | null',
  `MulExpression2   ->  Identifier MulExpression'' | Literal $binaryExpression MulExpression1`,
  `MulExpression''  ->  $binaryExpression MulExpression1 | CallSuffix $binaryExpression MulExpression1`,
  'Operator1        ->  plus | minus',
  'Operator2        ->  multiply | divide',
  'Literal          ->  literal | leftBracket AddExpression rightBracket | Operator1 Literal1',
  `Literal1         ->  literal $unaryExpression | Identifier Literal2 $unaryExpression`,
  `Literal2         ->  CallSuffix | null`,
  'Identifier       ->  identifier',
  // 声明
  "Defined          ->  defined Identifier Defined'",
  `Defined'         ->  equal Defined'' | $declaration null`,
  `Defined''        ->  Expression $declarationInit | Block $declarationInit | Condition $declarationInit`,
  // 赋值
  'Assignment       ->  Identifier Assignment1',
  'Assignment1      ->  $expressionStatement equal Expression $assignment | CallSuffix | null',
  // 块作用域
  "Block            ->  begin $appendBlock Sentence Block'",
  "Block'           ->  end $popBlock | return Block''",
  "Block''          ->  Expression Block''' | Function Block''' | Condition Block'''",
  "Block'''         ->  $assignReturn Semicolon end $popBlock",
  // 方法
  "Function         ->  function identifier $assignFunctionId leftBracket Params rightBracket Colon Block $assignFunctionBody",
  "Arguments        ->  Expression $assignArgument Arguments' | null",
  "Arguments'       ->  Comma Expression $assignArgument Arguments' | null",
  "Params           ->  Identifier $assignParam Params' | null",
  "Params'          ->  Comma Identifier $assignParam | null",
  'Comma            ->  comma',
  'Colon            ->  colon',
  'CallSuffix       ->  $callExpression leftBracket Arguments rightBracket $expressionStatement',
  // 条件语句
  'Condition        ->  If Elif',
  'If               ->  if leftBracket Expression rightBracket $appendIfTest Colon Block $appendIfConsequent',
  'Elif             ->  elif leftBracket Expression rightBracket $appendIfTest Colon Block $appendIfConsequent $appendIfAlternate Elif | Else | null',
  'Else             ->  else Colon Block $appendIfAlternate'
];
const terminalSymbols =
  'defined|identifier|equal|semicolon|leftBracket|rightBracket|literal|plus|minus|multiply|divide|function|begin|end|return|comma|colon|if|elif|else'
    .split('|');

const ll1 = makeLL1(grammars, terminalSymbols);

const _defined = (kind, line, start, end) => {
  return {
    type: AstType['VariableDeclaration'],
    line,
    start,
    end,
    declarations: [],
    kind
  };
};

const _identifier = (name, line, start, end) => {
  return {
    type: AstType['Identifier'],
    line,
    start,
    end,
    name
  };
};

const _literal = (raw, line, start, end) => {
  let value
  if(/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(raw)) value = Number(raw)
  else if(raw[0] === '"' && raw[raw.length - 1] === '"') value = String(raw)
  return {
    type: AstType['Literal'],
    line,
    start,
    end,
    value,
    raw
  };
};

const _equal = (operator, line, start, end) => {
  return {
    type: AstType['EqualExpression'],
    line,
    start,
    end,
    operator
  };
};

const _plus = (operator, line, start, end) => {
  return {
    type: AstType['PlusExpression'],
    line,
    start,
    end,
    operator
  };
};

const _minus = (operator, line, start, end) => {
  return {
    type: AstType['MinusExpression'],
    line,
    start,
    end,
    operator
  };
};

const _multiply = (operator, line, start, end) => {
  return {
    type: AstType['MultiplyExpression'],
    line,
    start,
    end,
    operator
  };
};

const _divide = (operator, line, start, end) => {
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
    end: operator.end,
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
    end: left.end,
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
    declarator.end,
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
    declarator.end,
    identifier,
    expression
  );
  declarator.declarations.push(ast);
  astList.splice(startIdx + 1, 3);
};

const $expressionStatement = (astList) => {
  const startIdx = astList.length - 1
  const identifier = astList[startIdx];
  const ast = createExpressionStatement(
    identifier.line, identifier.start, identifier.end, identifier
  )
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
    end: statement.end,
    operator: operator.operator,
    left: statement.expression,
    right: expression
  };
  statement.expression = ast;
  astList.splice(startIdx + 1, 2);
};

const _function = (_, line, start, end) => {
  return {
    type: AstType["FunctionExpression"],
    line,
    start,
    end,
    id: null,
    params: [],
    body: null
  }
}

const $assignFunctionId = (astList) => {
  const startIdx = astList.length - 2
  const func = astList[startIdx]
  const identifier = astList[startIdx + 1]
  func.id = identifier
  astList.splice(startIdx + 1, 1)
}

const $assignParam = (astList) => {
  const startIdx = astList.length - 2
  const func = astList[startIdx]
  const identifier = astList[startIdx + 1]
  func.params.push(identifier)
  astList.splice(startIdx + 1, 1)
}

const $assignArgument = (astList) => {
  const startIdx = astList.length - 2
  const call = astList[startIdx]
  const identifier = astList[startIdx + 1]
  call.arguments.push(identifier)
  astList.splice(startIdx + 1, 1)
}

const _begin = (_, line, start, end) => {
  return {
    type: AstType['BlockStatement'],
    line,
    start,
    end,
    body: []
  }
}

const $appendBlock = (astList, blocks) => {
  const startIdx = astList.length - 1
  const block = astList[startIdx]
  blocks.push(block.body)
}

const $popBlock = (_, blocks) => {
  blocks.pop()
}

const $assignFunctionBody = (astList) => {
  const startIdx = astList.length - 2
  const func = astList[startIdx]
  const body = astList[startIdx + 1]
  func.body = body
  astList.splice(startIdx + 1, 1)
}

const _return = (_, line, start, end) => {
  return {
    type: AstType["ReturnStatement"],
    line,
    start,
    end,
    argument: null
  }
}

const $assignReturn = (astList) => {
  const startIdx = astList.length - 2
  const retur = astList[startIdx]
  const body = astList[startIdx + 1]
  retur.argument = body
  astList.splice(startIdx + 1, 1)
}

const $callExpression = (astList) => {
  const startIdx = astList.length - 1
  const identifier = astList[startIdx]
  const callExpression = {
    type: AstType["CallExpression"],
    line: identifier.line,
    start: identifier.start,
    end: identifier.end,
    callee: identifier,
    arguments: []
  }
  astList.splice(startIdx, 1, callExpression)
}

const _if = (_, line, start, end) => {
  return {
    type: AstType['IfStatement'],
    line, start, end,
    test: null,
    consequent: null
  }
}
const _elif = _if

const $appendIfTest = (astList) => {
  const startIdx = astList.length - 2
  const ifStatement = astList[startIdx]
  const test = astList[startIdx + 1]
  ifStatement.test = test
  astList.splice(startIdx + 1, 1)
}

const $appendIfConsequent = (astList) => {
  const startIdx = astList.length - 2
  const ifStatement = astList[startIdx]
  const consequent = astList[startIdx + 1]
  ifStatement.consequent = consequent
  astList.splice(startIdx + 1, 1)
}

const $appendIfAlternate = (astList) => {
  const startIdx = astList.length - 2
  const ifStatement = astList[startIdx]
  const alternate = astList[startIdx + 1]
  let cur = ifStatement
  while(cur.alternate && cur.alternate.type === AstType['IfStatement']) {
    cur = cur.alternate
  }
  cur.alternate = alternate
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

const createExpressionStatement = (
  line, start, end, expression = null
) => ({
  type: AstType["ExpressionStatement"],
  line,
  start,
  end,
  expression
});

module.exports = {
  startSymbol: ll1.startSymbol,
  predictSet: ll1.predictSet,
  AstType,
  constructor: {
    _defined,
    _identifier,
    _literal,
    _equal,
    _plus,
    _minus,
    _multiply,
    _divide,
    _function,
    $unaryExpression,
    $binaryExpression,
    $declaration,
    $declarationInit,
    $expressionStatement,
    $assignment,
    $assignFunctionId,
    $assignArgument,
    _begin,
    $appendBlock,
    $popBlock,
    $assignFunctionBody,
    _return,
    $assignReturn,
    $callExpression,
    $assignParam,
    _if,
    $appendIfTest,
    $appendIfConsequent,
    _elif,
    $appendIfAlternate
  }
};