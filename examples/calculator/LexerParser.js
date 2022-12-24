const { Scanner } = require('../Scanner');
const { Token } = require('../Token');
const Error = require('../Error');

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
};

class LexerParser {

  isNumber(char) {
    return char >= '0' && char <= '9';
  }

  isBlank(char) {
    return char === ' ' || char === '\t';
  }

  isLine(char) {
    return char === '\r' || char === '\n';
  }

  tokenize(sentence) {
    const tokens = [];

    let char;
    let fragment = '';
    let state = tokenType.Initial;
    let line = 0;
    let start = 0;
    let changStart = 0;
    const scanner = new Scanner(sentence + ' ');

    const initState = () => {
      changStart = scanner.pos;
      fragment = '';
      if (this.isNumber(char)) {
        fragment += char;
        state = tokenType.literal;
      } else if (this.isBlank(char)) {
        fragment = '';
        state = tokenType.Initial;
      } else if (this.isLine(char)) {
        line++;
        start = 0;
        fragment = '';
        state = tokenType.Initial;
      } else {
        fragment += char;
        switch (char) {
          case '(':
            state = tokenType.leftBracket;
            break;
          case ')':
            state = tokenType.rightBracket;
            break;
          case '+':
            state = tokenType.plus;
            break;
          case '-':
            state = tokenType.minus;
            break;
          case '*':
            state = tokenType.multiply;
            break;
          case '/':
            state = tokenType.divide;
            break;
          default:
            const message = sentence.slice(0, changStart) + "\x1b[31;2;4m" + sentence.slice(changStart, scanner.pos + 1) + "\x1b[0m" + sentence.slice(scanner.pos + 1);
            Error.syntaxError(`Unknown token '${"\x1b[31;2;4m" + sentence.slice(changStart, scanner.pos + 1) + "\x1b[0m"}'`, {
              message,
              line,
              start
            });
        }
      }
    };

    while (char = scanner.peek()) {
      start++;
      switch (state) {
        case tokenType.Initial:
          initState();
          break;
        case tokenType.literal:
          if (this.isNumber(char)) {
            if (fragment[0] === '0') {
              const message = sentence.slice(0, changStart) + "\x1b[31;2;4m" + sentence.slice(changStart, scanner.pos + 1) + "\x1b[0m" + sentence.slice(scanner.pos + 1);
              Error.syntaxError('Numbers cannot contain leading zeros', {
                message,
                line,
                start: start - fragment.length
              });
            } else {
              fragment += char;
            }
          } else if (char === '.') {
            fragment += char;
            state = tokenType.point;
          } else {
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.point:
          if (this.isNumber(char)) {
            fragment += char;
          } else if (char === '.') {
            const message = sentence.slice(0, changStart) + "\x1b[31;2;4m" + sentence.slice(changStart, scanner.pos + 1) + "\x1b[0m" + sentence.slice(scanner.pos + 1);
            Error.syntaxError(`Unexpected token '${"\x1b[31;2;4m.\x1b[0m"}'`, {
              message,
              line,
              start: start - fragment.length
            });
          } else {
            tokens.push(
              new Token(tokenType.literal, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.leftBracket:
        case tokenType.rightBracket:
        case tokenType.plus:
        case tokenType.minus:
        case tokenType.multiply:
        case tokenType.divide:
          tokens.push(
            new Token(state, fragment, line, start - fragment.length, start - 1)
          );
          state = tokenType.Initial;
          initState();
          break;
      }
      scanner.step();
    }

    return tokens;
  }
}

module.exports = { LexerParser };
