const { mergeSet } = require('./utils');
const { EMPTY_CHAIN, $ } = require('./constants');

/**
  1、依次遍历所有产生式，把串首终结符加入其 FIRST 集中。
  2、如果最左串是非终结符，则把该非终结符的 FIRST 集推入到当前产生式中，如果该非终结符包含空，那么把该非终结符的 FIRST 集 - 空推入到当前产生式中，同时把该非终结符的下一个非终结符的 FIRST 集推入到当前产生式中，重复第二步直至遇到没有包含空的非终结符为止。
  3、重新遍历所有产生式，重复执行步骤 1、2，直至所有产生式均无变化。
 */
function makeFirstSet(rules, terminalSymbols) {
  const isTerminal = (chain) => terminalSymbols.includes(chain) || chain === EMPTY_CHAIN;

  const firstSet = {};
  rules.forEach(({ left }) => firstSet[left] = []);

  let isSetChanged;
  do {
    isSetChanged = false;
    rules.forEach(({ left, right }) => {
      let sets = new Set(firstSet[left]);
      const prevLength = sets.size;

      // 处理诸如 E -> A | B 的情况需要遍历
      right.forEach(exp => {
        let first = 0;
        let chain = exp[first];

        while (chain?.[0] === $) {
          chain = exp[++first];
        }

        if (isTerminal(chain)) sets.add(chain);
        else if (firstSet[chain].includes(EMPTY_CHAIN)) {

          do {
            const nextSet = new Set(firstSet[chain]);
            nextSet.delete(EMPTY_CHAIN);
            sets = mergeSet(sets, nextSet);
            first += 1;
            chain = exp[first];

            while (chain?.[0] === $) {
              chain = exp[++first];
            }

          } while (firstSet[chain]?.includes(EMPTY_CHAIN));

          if (isTerminal(chain)) sets.add(chain);
          else sets = mergeSet(sets, firstSet[chain]);
        }
        else sets = mergeSet(sets, firstSet[chain]);
      });

      firstSet[left] = [...sets];
      if (prevLength !== sets.size) isSetChanged = true;
    });

  } while (isSetChanged);

  return firstSet;
}

function makeUnionFirstSet(chainSet, firstSet, terminalSymbols) {
  const isTerminal = (chain) => terminalSymbols.includes(chain) || chain === EMPTY_CHAIN;

  const unionFirstSet = [];

  chainSet.some(chain => {
    if(chain[0] === $) return false
    if (isTerminal(chain)) {
      unionFirstSet.push(chain);
    } else if (!firstSet[chain].includes(EMPTY_CHAIN)) {
      unionFirstSet.push(...firstSet[chain]);
    } else {
      return false;
    }
    return true;
  });

  return unionFirstSet;
}

module.exports = { makeFirstSet, makeUnionFirstSet };
