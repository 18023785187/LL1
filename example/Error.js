
class Error {
  syntaxError(message, location) {
    throw new SyntaxError(`${message}
    ${location ? `at ${location.message} (${location.line}:${location.start})` : ''}`
    )
  }
}

module.exports = new Error()