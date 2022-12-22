const { makeFirstSet } = require('./makeFirstSet');
const { mergeSet } = require('./utils');
const { EMPTY_CHAIN, $ } = require('./constants');

/**
    设有式子 S -> (L) | aL | LC，规则如下：
  1、如果 L 的右边是终结符，那么把这个终结符加到 L 的 FOLLOW 集中。
  2、如果 L 的右边是非终结符，那么把这个非终结符的 FIRST 集 - 空 加到 L 的 FOLLOW 集中。
  3、如果 L 处在末尾，那么把 -> 左边符号的 FOLLOW 集 加入到 L 的 FOLLOW 集中。
  4、当 L 的式子包含空时，对 L 的左边非终结符采用 1、2、3 规则，依次类推。

  推导过程

  1、在第一个产生式加入 $ 作为终止符。
  2、依次遍历产生式，依序遍历产生式右边，对每个串运用规则。
  3、重复执行步骤 2，直至所有产生式均无变化。
 */
function makeFollowSet(
  rules,
  terminalSymbols,
  firstSet = makeFirstSet(rules, terminalSymbols)
) {
  const isTerminal = (chain) => terminalSymbols.includes(chain) || chain === EMPTY_CHAIN;

  const followSet = {};
  rules.forEach(({ left }) => followSet[left] = []);
  followSet[rules[0].left].push($);

  const emptySet = new Set();
  for (const tag in firstSet) firstSet[tag].includes(EMPTY_CHAIN) && emptySet.add(tag);

  let isSetChanged;
  do {

    isSetChanged = false;
    rules.forEach(({ left, right }) => {
      right.forEach(exp => {
        for (let i = exp.length - 1; i >= 0; --i) {
          const chain = exp[i];

          if (isTerminal(chain) || chain[0] === $) continue;

          let prevLength = followSet[chain].length;
          if (i === exp.length - 1) {
            followSet[chain] = [...mergeSet(followSet[chain], followSet[left])];
          } else {
            let j = i + 1;
            let nextChain = exp[j];

            while(j < exp.length && nextChain[0] === $) {
              nextChain = exp[++j]
            }

            if (isTerminal(nextChain)) {
              followSet[chain] = [...mergeSet(followSet[chain], [nextChain])];
            } else {
              const nextSet = new Set(firstSet[nextChain]);
              nextSet.delete(EMPTY_CHAIN);
              followSet[chain] = [...mergeSet(followSet[chain], nextSet)];

              while (j < exp.length && (emptySet.has(nextChain) || nextChain[0] === $)) nextChain = exp[++j];
              if (j === exp.length) followSet[chain] = [...mergeSet(followSet[chain], followSet[left])];
            }
          }

          if (followSet[chain].length !== prevLength) isSetChanged = true;
        }
      });
    });

  } while (isSetChanged);

  return followSet;
}

module.exports = { makeFollowSet };
