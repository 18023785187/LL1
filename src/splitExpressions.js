const { EMPTY_CHAIN, OR } = require('./constants');

/**
 * 生成式必须以空格作为分隔符，以 | 作为或，以 null 作为空串
 * 
 * 如: 1、['E -> ( id ) | null']
 *     2、['E -> ( id )', 'E -> null']
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

function toExpressions(rules, isExpand = false) {
  const expressions = [];

  rules.forEach(({ left, right }) => {
    if (isExpand) {
      right.forEach(exp => {
        let expression = '';

        expression += `${left} -> ${exp.map(chain => chain + '').join(' ')}`;
        expressions.push(expression);
      });
    } else {
      let expression = '';

      expression += `${left} -> `;
      right.forEach(exp => {
        expression += exp.map(chain => chain + '').join(' ') + ` ${OR} `;
      });

      expressions.push(expression.slice(0, -3));
    }
  });

  return expressions;
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
  const rightToString = (right) => right.join(OR);
  const newRules = [];

  const commonSuffix = new Map(); /** 复用已有产生式或提取公共因子后剩余后缀的产生式 */
  rules.forEach(({ left, right }) => {
    commonSuffix.set(rightToString(right), left);
  });

  rules.forEach(({ left, right }) => {
    handleRule(left, right, new Map());
  });

  function handleRule(left, right) {
    commonSuffix.set(rightToString(right), left);

    let repeat = 0;
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

      if (i === right.length - 1) {
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

        prefix += chain + OR;
        pos++;
      }

      if (prefix) {
        const suffixes = commonExps.map(exp => {
          const suffix = exp.slice(prefix.slice(0, -1).split(OR).length);
          if (!suffix.length) return [EMPTY_CHAIN];
          return suffix;
        });

        let newLeft;
        if (commonSuffix.has(rightToString(suffixes))) {
          newLeft = commonSuffix.get(rightToString(suffixes));
        } else {
          newLeft = `${left}${"'".repeat(repeat)}'`;
        }
        const newRight = [...prefix.slice(0, -1).split(OR), newLeft];
        explanation.right.push(newRight);
        if (!isInsertRoot) {
          newRules.push(explanation);
          repeat++;
        };

        if (!commonSuffix.has(rightToString(suffixes)))
          handleRule(newLeft, suffixes);
      } else {
        explanation.right.push([...right[i]]);
        if (!isInsertRoot) {
          newRules.push(explanation);
        };
      }
      isInsertRoot = true;
    }
  }
  return newRules;
}

/**
 * 基于 splitExpressions 方法返回的 rules 进行消除左递归
 * 
 * 左递归分为直接左递归和间接左递归，直接左递归调用 clearDirectLeftRecursion 函数进行消除，间接左递归通过代入产生式降级为直接左递归进行消除，
 * 为了与提取公共因子进行区分，消除左递归引入的新产生式用 ` 标记，如：E -> E + T 消除后得 E -> T E`  E` -> + T E` | null
 * 
 * A -> A a1 | A a2 | ... | A an | b1 | b2 | ... | bm
 * 
 * ---->
 * 
 *  A -> b1A` | b2A` | ... | bmA`
 *  A' -> a1A` | a2A` | ... | anA` | null
 * 
 */
function clearLeftRecursion(rules) {
  const newRules = [];

  rules.forEach(rule => {
    newRules.push(
      ...clearDirectLeftRecursion(rule)
    );
  });

  function clearDirectLeftRecursion(
    { left, right } /** rule */
  ) {
    const rules = [];
    const newLeft = `${left}\``;

    const prefixExps = [];
    const exps = [];
    let isEmpty = false;
    right.forEach(exp => {
      if (exp[0] === left) {
        exp.shift();
        exp.push(newLeft);
        prefixExps.push(exp);
      } else if (exp[0] === EMPTY_CHAIN) {
        isEmpty = true;
      } else {
        exp.push(newLeft);
        exps.push(exp);
      }
    });

    if (isEmpty) {
      exps.push([newLeft]);
    }

    rules.push(
      {
        left,
        right: [...exps]
      },
      {
        left: newLeft,
        right: [...prefixExps, [EMPTY_CHAIN]]
      }
    );

    return rules;
  }

  return newRules;
}

module.exports = { splitExpressions, toExpressions, combineLikeTerms, clearLeftRecursion };
