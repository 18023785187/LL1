
function mergeSet(set1, set2) {
  return new Set([...set1, ...set2]);
}

function isBlank(char) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

module.exports = {
  mergeSet,
  isBlank
};
