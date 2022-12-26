/**
 * 10进制四则运算器，可加减乘除，可括号优先级，可负数。
 */
const { LexerParser } = require('./LexerParser');
const { SyntacticParser } = require('../SyntacticParser');
const { startSymbol, predictSet, constructor, AstType } = require('./grammar');
const Error = require('../Error');

class Variable {
  __system__ = true
  constructor(isRead, value) {
    this.isRead = isRead;
    this.value = value;
    this.type = 'Variable'
  }
}

class Func {
  __system__ = true
  constructor(name, params, body, scope) {
    this.name = name
    this.params = params.map(param => param.name)
    this.length = params.length
    this.body = body
    this.scope = scope
    this.type = 'Function'
  }
}

class SystemFunction {
  __system__ = true
  constructor(name, func) {
    this.name = name
    this.func = func
    this.type = 'SystemFunction'
  }
}

class Scope {
  constructor(parent) {
    this.parent = parent
    this.scope = new Map()
  }

  has(identifier) {
    return this.scope.has(identifier)
  }

  get(identifier) {
    let cur = this
    while (cur && !cur.has(identifier)) {
      cur = cur.parent
    }

    if (cur) {
      return cur.scope.get(identifier)
    }
  }

  set(identifier, value) {
    const scope = this.get(identifier)

    if (scope) scope.scope.set(identifier, value)
    else this.scope.set(identifier, value)
  }

  clear() {
    this.scope.clear()
  }
}

function compiler(sentence) {
  const lexerParser = new LexerParser();
  const syntacticParser = new SyntacticParser(startSymbol, predictSet, constructor);

  const tokens = lexerParser.tokenize(sentence);
  const ast = syntacticParser.parse(tokens);

  const globalScope = new Scope();
  globalScope.set('print', new SystemFunction(
    'print',
    (args) => {
      console.log(...args.map(arg => toVal(arg)))
    }
  ))
  globalScope.set('eval', new SystemFunction(
    'eval',
    (args) => {
      const tokens = lexerParser.tokenize(args[0].slice(1, -1));
      const ast = syntacticParser.parse(tokens);
      return handle(ast, null, new Scope(globalScope))
    }
  ))

  const toVal = (val) => {
    if (!val) return val
    switch (val.type) {
      case 'Variable': return val.value
      case 'Function':
      case 'SystemFunction':
        return `\x1b[34;2m<${val.type} ${val.name}>\x1b[0m`
      default: return val
    }
  }

  handle(ast, null, globalScope)
  function handle(root, gist, scope) {
    switch (root.type) {
      case 'Program': 
      case AstType['BlockStatement']: {
        if(root.type === 'Program') {}
        else if(gist) {
          scope = gist
        } else {
          scope = new Scope(scope)
        }
        let __result__
        for (let i = 0; i < root.body.length; ++i) {
          __result__ = handle(root.body[i], null, scope);
        }

        const tail = root.body[root.body.length - 1]
        return tail?.type === AstType['ReturnStatement'] ? __result__ : undefined;
      }
      case AstType['VariableDeclaration']:
        const declarations = root.declarations;
        for (let i = 0; i < declarations.length; ++i) {
          const declaration = declarations[i];
          handle(declaration, root.kind, scope);
        }
        break;
      case AstType['VariableDeclarator']:
        const id = root.id;
        const init = root.init;
        if (!scope.has(id.name)) {
          if (gist === 'def') {
            scope.scope.set(
              id.name,
              new Variable(
                false,
                init ? handle(init, null, scope) : undefined
              )
            );
          } else if (gist === 'read') {
            if (init) {
              scope.scope.set(
                id.name,
                new Variable(
                  true,
                  handle(init, null, scope)
                )
              );
            } else {
              Error.syntaxError(
                `Missing initializer in read declaration`,
                {
                  message: '',
                  line: id.line,
                  start: id.start
                }
              );
            }
          }
        } else {
          Error.syntaxError(
            `Identifier '${"\x1b[31;2;4m" + id.name + "\x1b[0m"}' has already been declared`,
            {
              message: '',
              line: id.line,
              start: id.start
            }
          );
        }
        break;
      case AstType['ExpressionStatement']:
        const expression = root.expression;
        return handle(expression, null, scope);
      case AstType['AssignmentExpression']: {
        const identifier = root.left;
        const variable = scope.get(identifier.name);

        if (!variable) {
          Error.syntaxError(
            `Identifier '${"\x1b[31;2;4m" + identifier.name + "\x1b[0m"}' is not declared`,
            {
              message: '',
              line: identifier.line,
              start: identifier.start
            });
        }
        if (variable.type === 'Function') {
          Error.typeError(
            `Assignment to constant variable.`,
            {
              message: 'Function is not variable',
              line: identifier.line,
              start: identifier.start
            });
        }
        if (variable.isRead) {
          Error.typeError(
            `Assignment to constant variable.`,
            {
              message: '<anonymous>',
              line: identifier.line,
              start: identifier.start
            });
        } else {
          variable.value = handle(root.right, null, scope);
        }
        break;
      }
      case AstType['Identifier']:
        const variable = scope.get(root.name);
        if (variable) {
          return variable;
        } else {
          Error.referenceError(
            `'${"\x1b[31;2;4m" + root.name + "\x1b[0m"}' is not defined`,
            {
              message: '',
              line: root.line,
              start: root.start
            });
        }
        break;
      case AstType['Literal']:
        return root.value;
      case AstType['UnaryExpression']:
        switch (root.operator) {
          case '+': return + toVal(handle(root.argument, null, scope));
          case '-': return - toVal(handle(root.argument, null, scope));
        }
      case AstType['BinaryExpression']:
        switch (root.operator) {
          case '+': return toVal(handle(root.left, null, scope)) + toVal(handle(root.right, null, scope));
          case '-': return toVal(handle(root.left, null, scope)) - toVal(handle(root.right, null, scope));
          case '*': return toVal(handle(root.left, null, scope)) * toVal(handle(root.right, null, scope));
          case '/': return toVal(handle(root.left, null, scope)) / toVal(handle(root.right, null, scope));
        }
        break;
      case AstType['FunctionExpression']:
        const { id: funcId, params, body } = root
        const set = new Set()
        params.some(param => {
          if (!set.has(param.name)) {
            set.add(param.name)
          } else {
            Error.syntaxError(
              `Identifier 'Not repeatable params: ${"\x1b[31;2;4m" + param.name + "\x1b[0m"}'`,
              {
                message: '',
                line: param.line,
                start: param.start
              }
            )
          }
        })
        if (!scope.has(funcId.name)) {
          scope.set(
            funcId.name,
            new Func(
              funcId.name,
              params,
              body,
              new Scope(scope)
            )
          )
          return scope.get(funcId.name)
        } else {
          Error.syntaxError(
            `Identifier '${"\x1b[31;2;4m" + funcId.name + "\x1b[0m"}' has already been declared`,
            {
              message: '',
              line: funcId.line,
              start: funcId.start
            }
          );
        }
        break;
      case AstType['CallExpression']:
        const { callee, arguments } = root
        const func = handle(callee, null, scope)
        if (func.type === 'SystemFunction') {
          func.func(arguments.map(
            argument => {
              const val = handle(argument, null, scope)
              return val?.type === 'Variable' ? toVal(val) : val
            }
          ))
        } else {
          func.params.forEach((param, i) => {
            if (arguments[i] == null) {
              func.scope.set(
                param,
                new Variable(false, undefined)
              )
            } else {
              const val = handle(arguments[i], null, scope)
              func.scope.set(
                param,
                val.__system__ ? val : new Variable(
                  false,
                  val
                )
              )
            }
          })
          const result = handle(func.body, func.scope, func.scope)
          func.scope.clear()
          return result
        }
        break
      case AstType['ReturnStatement']:
        return handle(root.argument, null, scope)
      default:
        break;
    }
  };
}

module.exports = { compiler };
