// run npx babel-node index.js
import { splitGrammars, toGrammars, combineLikeTerms, clearLeftRecursion } from './splitGrammars.js';
import { makeFirstSet, makeUnionFirstSet } from './makeFirstSet.js';
import { makeFollowSet } from './makeFollowSet.js';
import { makeSelectSet, isNotIntersect } from './makeSelectSet.js';
import { makePredictSet } from './makePredictSet.js';
import { EMPTY_CHAIN, $ } from './constants.js';

function makeLL1(grammars, terminalSymbols) {
  const rules = splitGrammars(grammars);

  const firstSet = makeFirstSet(rules, terminalSymbols);
  const followSet = makeFollowSet(rules, terminalSymbols, firstSet);
  const selectSet = makeSelectSet(rules, terminalSymbols, firstSet, followSet);
  const predictSet = makePredictSet(selectSet);

  return {
    startSymbol: rules[0].left,
    firstSet,
    followSet,
    selectSet,
    predictSet,
    print() {
      const leftSet = [];
      const chainSet = [];

      const indent = 2;
      let maxLength = indent;

      for (const [chain] of predictSet) {
        chainSet.push(chain);
        maxLength = Math.max(maxLength, chain.length + indent);
      }
      for (const left in firstSet) {
        leftSet.push(left);
        maxLength = Math.max(maxLength, left.length + indent);
      }

      const result = new Array(leftSet.length + 1).fill([]).map(() => new Array(chainSet.length + 1).fill(''));

      for (let i = 0; i < chainSet.length; ++i) {
        result[0][i + 1] = chainSet[i];
      }
      for (let i = 0; i < leftSet.length; ++i) {
        result[i + 1][0] = leftSet[i];
      }

      for (const [chain, ruleMap] of predictSet) {
        const col = result[0].indexOf(chain);
        let row;

        for (const [left, right] of ruleMap) {
          for (let i = 0; i < leftSet.length; ++i) {
            if (result[i + 1][0] === left) {
              row = i + 1;
              break;
            }
          }

          result[row][col] = `-> ${right.map(item => item + '').join(' ')}`;

          maxLength = Math.max(maxLength, result[row][col].length + indent);
        }
      }

      let colLength = (maxLength + indent);
      let logStr = '';
      let splitStr = '\n' + ('|' + '-'.repeat(colLength)).repeat(chainSet.length + 1) + '|\n';
      for (let i = 0; i < result.length; ++i) {
        logStr += splitStr + '|';

        for (let j = 0; j < result[i].length; ++j) {
          const term = i === 0 || j === 0 ?
            " \x1b[33;1m " + result[i][j] + " \x1b[0m " :
            " \x1b[32;1m " + result[i][j] + " \x1b[0m ";
          logStr += term + ' '.repeat(maxLength + 13 - term.length) + '|';
        }
      }
      logStr += splitStr;
      console.log(logStr);
    }
  };
}

export {
  makeLL1,
  splitGrammars,
  toGrammars,
  combineLikeTerms,
  clearLeftRecursion,
  makeFirstSet,
  makeUnionFirstSet,
  makeFollowSet,
  makeSelectSet,
  isNotIntersect,
  makePredictSet,
  EMPTY_CHAIN,
  $,
};
