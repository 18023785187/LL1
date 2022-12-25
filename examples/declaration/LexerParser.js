const { Scanner } = require('../Scanner');
const { Token } = require('../Token');
const Error = require('../Error');

const tokenType = {
  Initial: 'Initial',
  literal: 'literal',
  identifier: 'identifier',
  point: 'point',
  leftBracket: 'leftBracket',
  rightBracket: 'rightBracket',
  plus: 'plus',
  minus: 'minus',
  multiply: 'multiply',
  divide: 'divide',
  semicolon: 'semicolon',
  equal: 'equal',
  colon: 'colon',
  comma: 'comma',
  def1: 'def1',
  def2: 'def2',
  def3: 'def3',
  readOrReturn1: 'readOrReturn1',
  readOrReturn2: 'readOrReturn2',
  read2: 'read2',
  read3: 'read3',
  read4: 'read4',
  func1: 'func1',
  func2: 'func2',
  func3: 'func3',
  func4: 'func4',
  begin1: 'begin1',
  begin2: 'begin2',
  begin3: 'begin3',
  begin4: 'begin4',
  begin5: 'begin5',
  end1: 'end1',
  end2: 'end2',
  end3: 'end3',
  return2: 'return2',
  return3: 'return3',
  return4: 'return4',
  return5: 'return5',
  return6: 'return6',
  defined: 'defined',
  function: 'function',
  begin: 'begin',
  end: 'end',
  return: 'return',
  comment: 'comment',
  quotation: 'quotation',
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

  isAlphabet(char) {
    return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z';
  }

  tokenize(sentence) {
    const tokens = [];
    if (!sentence) return tokens;

    let char;
    let fragment = '';
    let state = tokenType.Initial;
    let line = 1;
    let start = 0;
    let changStart = 0;
    const scanner = new Scanner(sentence + ' ');

    const initState = () => {
      changStart = scanner.pos;
      fragment = '';
      if (this.isNumber(char)) {
        fragment += char;
        state = tokenType.literal;
      } else if (this.isAlphabet(char)) {
        fragment += char;
        switch (char) {
          case 'd':
            state = tokenType.def1;
            break;
          case 'r':
            state = tokenType.readOrReturn1;
            break;
          case 'f':
            state = tokenType.func1;
            break;
          case 'b':
            state = tokenType.begin1
            break
          case 'e':
            state = tokenType.end1
            break
          default:
            state = tokenType.identifier;
            break;
        }
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
          case '=':
            state = tokenType.equal;
            break;
          case ';':
            state = tokenType.semicolon;
            break;
          case '#':
            state = tokenType.comment;
            break;
          case ':':
            state = tokenType.colon;
            break
          case ',':
            state = tokenType.comma
            break
          case '"':
            state = tokenType.quotation
            break
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
        case tokenType.identifier:
          if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
          } else {
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.def1:
          if (char === 'e') {
            fragment += char;
            state = tokenType.def2;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.def2:
          if (char === 'f') {
            fragment += char;
            state = tokenType.def3;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.def3:
          if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.defined;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.readOrReturn1:
          if (char === 'e') {
            fragment += char;
            state = tokenType.readOrReturn2;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.readOrReturn2:
          if (char === 'a') {
            fragment += char;
            state = tokenType.read3;
          } else if (char === 't') {
            fragment += char;
            state = tokenType.return3;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.read3:
          if (char === 'd') {
            fragment += char;
            state = tokenType.read4;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.read4:
          if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.defined;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.func1:
          if (char === 'u') {
            fragment += char;
            state = tokenType.func2;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.func2:
          if (char === 'n') {
            fragment += char;
            state = tokenType.func3;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.func3:
          if (char === 'c') {
            fragment += char;
            state = tokenType.func4;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.func4:
          if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.function;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.begin1:
          if (char === 'e') {
            fragment += char;
            state = tokenType.begin2;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.begin2:
          if (char === 'g') {
            fragment += char;
            state = tokenType.begin3;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.begin3:
          if (char === 'i') {
            fragment += char;
            state = tokenType.begin4;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.begin4:
          if (char === 'n') {
            fragment += char;
            state = tokenType.begin5;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.begin5:
          if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.begin;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.end1:
          if (char === 'n') {
            fragment += char;
            state = tokenType.end2;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.end2:
          if (char === 'd') {
            fragment += char;
            state = tokenType.end3;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.end3:
          if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.end;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.return3:
          if (char === 'u') {
            fragment += char;
            state = tokenType.return4;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.return4:
          if (char === 'r') {
            fragment += char;
            state = tokenType.return5;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.return5:
          if (char === 'n') {
            fragment += char;
            state = tokenType.return6;
          } else if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.identifier;
            tokens.push(
              new Token(state, fragment, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
            initState();
          }
          break;
        case tokenType.return6:
          if (this.isAlphabet(char) || this.isNumber(char)) {
            fragment += char;
            state = tokenType.identifier;
          } else {
            state = tokenType.return;
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
        case tokenType.quotation:
          if (char === '"') {
            tokens.push(
              new Token(tokenType.literal, fragment + char, line, start - fragment.length, start - 1)
            );
            state = tokenType.Initial;
          } else if (this.isLine(char)) {
            fragment += char;
            line++;
            start = 0;
          } else {
            fragment += char;
          }
          break
        case tokenType.leftBracket:
        case tokenType.rightBracket:
        case tokenType.plus:
        case tokenType.minus:
        case tokenType.multiply:
        case tokenType.divide:
        case tokenType.semicolon:
        case tokenType.equal:
        case tokenType.comma:
        case tokenType.colon:
          tokens.push(
            new Token(state, fragment, line, start - fragment.length, start - 1)
          );
          state = tokenType.Initial;
          initState();
          break;
        case tokenType.comment:
          if (this.isLine(char)) {
            line++;
            start = 0;
          } else if (char === '#') {
            fragment = '';
            state = tokenType.Initial;
          }
          break;
      }
      scanner.step();
    }

    return tokens;
  }
}

module.exports = { LexerParser };
