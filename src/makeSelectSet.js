const { makeFirstSet, makeUnionFirstSet } = require('./makeFirstSet');
const { makeFollowSet } = require('./makeFollowSet');
const { mergeSet } = require('./utils');
const { EMPTY_CHAIN, $ } = require('./constants');

/**
  对于形似 A -> ab 的产生式，其 SELECT 集为 FIRST(ab)。
  对于形似 A -> null 的产生式，其 SELECT 集为 FOLLOW(A)。

  推导过程

    1、对每个产生式进行拆分，如：
    E -> id | null 拆分成 E -> id，E -> null。
    2、运用规则求出每个产生式的 SELECT 集。
 */
function makeSelectSet(
  rules,
  terminalSymbols,
  firstSet = makeFirstSet(rules, terminalSymbols),
  followSet = makeFollowSet(rules, terminalSymbols)
) {
  const selectSet = new Map();

  rules.forEach(({ left, right }) => {
    right.forEach(chainSet => {
      let pos = 0
      let chain = chainSet[pos];
      const newRule = { left, right: chainSet };

      while(pos < chainSet.length && chain && chain[0] === $) {
        chain = chainSet[++pos]
      }

      if (chain === EMPTY_CHAIN) {
        selectSet.set(newRule, followSet[left]);
      } else {
        selectSet.set(newRule, makeUnionFirstSet(chainSet, firstSet, terminalSymbols));
      }
    });
  });

  return selectSet;
}

function isNotIntersect(selectSet) {
  const map = new Map();

  for (const [{ left }, sets] of selectSet) {
    if (map.has(left)) {
      const prevSets = map.get(left);
      const newSets = mergeSet(prevSets, sets);
      if (newSets.size !== prevSets.size + sets.length) {
        return false;
      }
      map.set(left, newSets);
    } else {
      map.set(left, new Set(sets));
    }
  }

  return true;
}

module.exports = { makeSelectSet, isNotIntersect };
