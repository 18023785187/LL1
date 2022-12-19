const { EMPTY_CHAIN } = require('./contants');

/**
 * 生成式必须以空格作为分隔符，以 | 作为或，以 null 作为空串
 * 
 * 如: 1、E -> ( id ) | null
 *     2、E -> ( id )   E -> null
 * 
 * 无论使用哪种写法最后返回的都会合并成一项，即合并成第一种写法的格式
 */
function splitExpressions(expressions) {
  const rules = [];
  const ruleMap = new Map(); // 用于缓存已经创建的产生式，避免重复创建相关的产生式

  for (let i = 0; i < expressions.length; ++i) {
    const expression = expressions[i];
    let [left, right] = expression.split('->');
    if (!right || !right.trim()) throw new Error('The expression is missing the right side');

    let isDefined = true;
    if (!ruleMap.has(left)) {
      isDefined = false;
      ruleMap.set(left, {
        left: null,
        right: []
      });
    }
    const explanation = ruleMap.get(left);
    explanation.left = left.trim();

    let fragment = [];
    let str = '';
    right += ' ';
    for (let j = 0; j < right.length; ++j) {
      const char = right[j];

      if (char === ' ') {
        if (str === 'null') {
          fragment.push(EMPTY_CHAIN);
        } else if (str) {
          fragment.push(str);
        }
        str = '';
      } else if (char === '|') {
        explanation.right.push(fragment);
        fragment = [];
        str = '';
      } else {
        str += char;
      }
    }

    if (fragment.length) explanation.right.push(fragment);
    !isDefined && rules.push(explanation);
  }

  return rules;
}

/**
 * 基于 splitExpressions 方法返回的 rules 进行提取公共因子
 * 
 * 提取公共因子产生的新表达式用原表达式加 ' 表示，如有多个公共因子以此类推，如：
 * 
 *  E -> + a | + b | * c | * d | y
 * 
 * 提取后为
 * 
 *  E -> + E' | * E'' | y
 *  E' -> a | b
 *  E'' -> c | d
 */
function combineLikeTerms(rules) {
  const mergeRight = (right) => [...right.map(exp => [...exp])];
  const newRules = [];

  rules.forEach(({ left, right }) => {
    handleRule(left, right, new Map());
  });

  function handleRule(left, right, commonSuffix /** 复用提取公共因子后剩余后缀的产生式 */) {
    if(commonSuffix.has(right.join('|'))) return
    commonSuffix.set(right.join('|'), left)

    let repeat = 0
    let isInsertRoot = false; // 标记新产生式是否已推入 newRules
    const explanation = {
      left,
      right: []
    };

    if (right.length === 1) {
      explanation.right = mergeRight(right);
      newRules.push(explanation);
      return;
    }

    let prefix;
    let chain;
    const skips = []; // 存储已合并的项下标
    for (let i = 0; i < right.length; ++i) { // 以当前产生式右边为参考系
      if (skips.includes(i)) continue;
      skips.push(i);

      if(i === right.length - 1) {
        explanation.right.push(right[i]);
        return;
      }

      const exp = right[i];
      let pos = 0;

      const commonExps = [];
      commonExps.push(exp);

      prefix = '';
      setPrefix:
      while (pos < exp.length) { // 当前产生式右边到尽头时，结束遍历
        chain = exp[pos];

        let isEqualChain = false;
        if (pos === 0) {
          for (let j = i + 1; j < right.length; ++j) {
            const curExp = right[j];
            const curChain = curExp[pos];
            if (!curChain) continue;

            if (curChain === chain) {
              isEqualChain = true;
              skips.push(j);

              commonExps.push(right[j]);
            }
          }
        } else {
          for (let j = i + 1; j < right.length; ++j) {
            const curExp = right[j];
            const curChain = curExp[pos];
            if (!curChain || curChain !== chain || !skips.includes(j)) continue;
            isEqualChain = true;
          }
        }
        if (!isEqualChain) break setPrefix;

        prefix += chain + '|';
        pos++;
      }

      if (prefix) {
        const suffixes = commonExps.map(exp => {
          const suffix = exp.slice(prefix.length / 2);
          if(!suffix.length) return [EMPTY_CHAIN]
          return suffix;
        });
        if(commonSuffix.has(suffixes.join('|'))) repeat--

        const newLeft = `${left}${"'".repeat(repeat)}'`;
        const newRight = [...prefix.slice(0, -1).split('|'), newLeft];
        explanation.right.push(newRight);
        if (!isInsertRoot) {
          newRules.push(explanation)
          repeat++
        };

        handleRule(newLeft, suffixes, commonSuffix);
      } else {
        explanation.right.push([...right[i]])
        if (!isInsertRoot) {
          newRules.push(explanation)
        };
      }
      isInsertRoot = true;
    }
  }
  return newRules;
}

module.exports = { splitExpressions, combineLikeTerms };
