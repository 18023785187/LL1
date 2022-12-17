const { mergeSet } = require('./utils')
const { EMPTY_CHAIN } = require('./contants')

/**
  1、依次遍历所有产生式，把串首终结符加入其 FIRST 集中。
  2、如果最左串是非终结符，则把该非终结符的 FIRST 集推入到当前产生式中，如果该非终结符包含空，那么把该非终结符的 FIRST 集 - 空推入到当前产生式中，同时把该非终结符的下一个非终结符的 FIRST 集推入到当前产生式中，重复第二步直至遇到没有包含空的非终结符为止。
  3、重新遍历所有产生式，重复执行步骤 1、2，直至所有产生式均无变化。
 */
function makeFirstSet(rules, terminalSymbols) {
  const isTerminal = (chain) => terminalSymbols.includes(chain) || chain === EMPTY_CHAIN

  const firstSet = {}
  rules.forEach(({ left }) => firstSet[left] = [])

  let isSetChanged
  do {
    isSetChanged = false
    rules.forEach(({ left, right }) => {
      let set = new Set(firstSet[left])
      const prevLength = set.size

      // 处理诸如 E -> A | B 的情况需要遍历
      right.forEach(exp => {
        let first = 0
        let chain = exp[first]

        if (isTerminal(chain)) set.add(chain)
        else if (firstSet[chain].includes(EMPTY_CHAIN)) {

          do {
            const nextSet = new Set(firstSet[chain])
            nextSet.delete(EMPTY_CHAIN)
            set = mergeSet(set, nextSet)
            first += 1
            chain = exp[first]

          } while (firstSet[chain]?.includes(EMPTY_CHAIN))

          if (isTerminal(chain)) set.add(chain)
          else set = mergeSet(set, firstSet[chain])
        }
        else set = mergeSet(set, firstSet[chain])
      })

      firstSet[left] = [...set]
      if (prevLength !== set.size) isSetChanged = true
    })

  } while (isSetChanged)

  return firstSet
}

module.exports = makeFirstSet
