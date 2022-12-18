const { EMPTY_CHAIN } = require('./contants')

/**
 * 生成式必须以空格作为分隔符，以 | 作为或，以 null 作为空串
 * 
 * 如：E -> ( id ) | null
 */
function splitExpressions(rules) {
  const expressions = []

  for (let i = 0; i < rules.length; ++i) {
    const rule = rules[i]
    let [left, right] = rule.split('->')
    if(!right || !right.trim()) throw new Error('The expression is missing the right side')

    let explanation = {
      left: null,
      right: []
    }
    explanation.left = left.trim()

    let fragment = []
    let str = ''
    right += ' '
    for(let j = 0; j < right.length; ++j) {
      const char = right[j]

      if(char === ' ') {
        if(str === 'null') {
          fragment.push(EMPTY_CHAIN)
        } else if(str) {
          fragment.push(str)
        }
        str = ''
      } else if(char === '|') {
        explanation.right.push(fragment)
        fragment = []
        str = ''
      } else {
        str += char
      }
    }

    if(fragment.length) explanation.right.push(fragment)
    expressions.push(explanation)
  }

  return expressions
}

module.exports = splitExpressions
