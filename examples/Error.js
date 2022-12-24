
class Error {
  syntaxError(message, location) {
    throw new SyntaxError(`${message}
    ${location ? `at ${location.message} (${location.line}:${location.start})` : ''}`
    );
  }
  typeError(message, location) {
    throw new TypeError(`${message}
    ${location ? `at ${location.message} (${location.line}:${location.start})` : ''}`
    );
  }
  referenceError(message, location) {
    throw new ReferenceError(`${message}
    ${location ? `at ${location.message} (${location.line}:${location.start})` : ''}`
    );
  }
}

module.exports = new Error();