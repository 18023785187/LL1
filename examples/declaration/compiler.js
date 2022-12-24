/**
 * 10进制四则运算器，可加减乘除，可括号优先级，可负数。
 */
const { LexerParser } = require('./LexerParser');
const { SyntacticParser } = require('../SyntacticParser');
const { startSymbol, predictSet, constructor, AstType } = require('./grammar');
const Error = require('../Error');

class Variable {
  constructor(isRead, value) {
    this.isRead = isRead;
    this.value = value;
  }
}

function compiler(sentence) {
  const lexerParser = new LexerParser();
  const syntacticParser = new SyntacticParser(startSymbol, predictSet, constructor);

  const tokens = lexerParser.tokenize(sentence);
  const ast = syntacticParser.parse(tokens);

  const globalScope = new Map();

  return (function handle(root, gist) {
    switch (root.type) {
      case 'Program':
        for (let i = 0; i < root.body.length; ++i) {
          handle(root.body[i]);
        }
        break;
      case AstType['VariableDeclaration']:
        const declarations = root.declarations;
        for (let i = 0; i < declarations.length; ++i) {
          const declaration = declarations[i];
          handle(declaration, root.kind);
        }
        break;
      case AstType['VariableDeclarator']:
        const id = root.id;
        const init = root.init;
        if (!globalScope.has(id.name)) {
          if (gist === 'def') {
            globalScope.set(
              id.name,
              new Variable(
                false,
                init ? handle(init) : undefined
              )
            );
          } else if (gist === 'read') {
            if (init) {
              globalScope.set(
                id.name,
                new Variable(
                  true,
                  handle(init)
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
        handle(expression);
        break;
      case AstType['AssignmentExpression']:
        const identifier = root.left;
        if (globalScope.has(identifier.name)) {
          const variable = globalScope.get(identifier.name);
          if (variable.isRead) {
            Error.typeError(
              `Assignment to constant variable.`,
              {
                message: '<anonymous>',
                line: identifier.line,
                start: identifier.start
              });
          } else {
            variable.value = handle(root.right);
          }
        } else {
          Error.syntaxError(
            `Identifier '${"\x1b[31;2;4m" + identifier.name + "\x1b[0m"}' is not declared`,
            {
              message: '',
              line: identifier.line,
              start: identifier.start
            });
        }
        break;
      case AstType['Identifier']:
        const variable = globalScope.get(root.name);
        if (!variable) {
          Error.referenceError(
            `'${"\x1b[31;2;4m" + root.name + "\x1b[0m"}' is not defined`,
            {
              message: '',
              line: root.line,
              start: root.start
            });
        } else {
          return variable.value;
        }
        break;
      case AstType['Literal']:
        return root.value;
      case AstType['UnaryExpression']:
        switch (root.operator) {
          case '+': return + handle(root.argument);
          case '-': return - handle(root.argument);
        }
      case AstType['BinaryExpression']:
        switch (root.operator) {
          case '+': return handle(root.left) + handle(root.right);
          case '-': return handle(root.left) - handle(root.right);
          case '*': return handle(root.left) * handle(root.right);
          case '/': return handle(root.left) / handle(root.right);
        }
        break;
      case AstType['PrintCallExpression']:
        console.log(handle(root.arguments[0]));
        break;
      default:
        break;
    }
  })(ast);
}

module.exports = { compiler };
