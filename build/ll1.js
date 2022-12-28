(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ll1"] = factory();
	else
		root["ll1"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "$": () => (/* reexport */ $),
  "EMPTY_CHAIN": () => (/* reexport */ EMPTY_CHAIN),
  "clearLeftRecursion": () => (/* reexport */ clearLeftRecursion),
  "combineLikeTerms": () => (/* reexport */ combineLikeTerms),
  "isNotIntersect": () => (/* reexport */ isNotIntersect),
  "makeFirstSet": () => (/* reexport */ makeFirstSet),
  "makeFollowSet": () => (/* reexport */ makeFollowSet),
  "makeLL1": () => (/* binding */ makeLL1),
  "makePredictSet": () => (/* reexport */ makePredictSet),
  "makeSelectSet": () => (/* reexport */ makeSelectSet),
  "makeUnionFirstSet": () => (/* reexport */ makeUnionFirstSet),
  "splitGrammars": () => (/* reexport */ splitGrammars),
  "toGrammars": () => (/* reexport */ toGrammars)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
;// CONCATENATED MODULE: ./src/constants.js
var EMPTY_CHAIN = null;
var OR = '|';
var $ = '$';
;// CONCATENATED MODULE: ./src/utils.js

function mergeSet(set1, set2) {
  return new Set([].concat(_toConsumableArray(set1), _toConsumableArray(set2)));
}
function isBlank(_char) {
  return _char === ' ' || _char === '\t' || _char === '\n' || _char === '\r';
}
;// CONCATENATED MODULE: ./src/splitGrammars.js





/**
 * 生成式必须以空格作为分隔符，以 | 作为或，以 null 作为空串
 * 
 * 如: 1、['E -> ( id ) | null']
 *     2、['E -> ( id )', 'E -> null']
 * 
 * 无论使用哪种写法最后返回的都会合并成一项，即合并成第一种写法的格式
 */
function splitGrammars(grammars) {
  var rules = [];
  var ruleMap = new Map(); // 用于缓存已经创建的产生式，避免重复创建相关的产生式

  for (var i = 0; i < grammars.length; ++i) {
    var grammar = grammars[i];
    var _grammar$split = grammar.split('->'),
      _grammar$split2 = _slicedToArray(_grammar$split, 2),
      left = _grammar$split2[0],
      right = _grammar$split2[1];
    if (!right || !right.trim()) throw new Error('Grammar is missing the right side');
    var isDefined = true;
    if (!ruleMap.has(left)) {
      isDefined = false;
      ruleMap.set(left, {
        left: null,
        right: []
      });
    }
    var grammarRule = ruleMap.get(left);
    grammarRule.left = left.trim();
    var fragment = [];
    var str = '';
    right += ' ';
    for (var j = 0; j < right.length; ++j) {
      var _char = right[j];
      if (isBlank(_char)) {
        if (str === 'null') {
          fragment.push(EMPTY_CHAIN);
        } else if (str) {
          fragment.push(str);
        }
        str = '';
      } else if (_char === '|') {
        grammarRule.right.push(fragment);
        fragment = [];
        str = '';
      } else {
        str += _char;
      }
    }
    if (fragment.length) grammarRule.right.push(fragment);
    !isDefined && rules.push(grammarRule);
  }
  return rules;
}
function toGrammars(rules) {
  var isExpand = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var grammars = [];
  rules.forEach(function (_ref) {
    var left = _ref.left,
      right = _ref.right;
    if (isExpand) {
      right.forEach(function (r) {
        var grammar = '';
        grammar += "".concat(left, " -> ").concat(r.map(function (chain) {
          return chain + '';
        }).join(' '));
        grammars.push(grammar);
      });
    } else {
      var grammar = '';
      grammar += "".concat(left, " -> ");
      right.forEach(function (r) {
        grammar += r.map(function (chain) {
          return chain + '';
        }).join(' ') + " ".concat(OR, " ");
      });
      grammars.push(grammar.slice(0, -3));
    }
  });
  return grammars;
}

/**
 * 基于 splitGrammars 方法返回的 rules 进行提取公共因子
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
  var mergeRight = function mergeRight(right) {
    return _toConsumableArray(right.map(function (grammar) {
      return _toConsumableArray(grammar);
    }));
  };
  var rightToString = function rightToString(right) {
    return right.join(OR);
  };
  var newRules = [];
  var commonSuffix = new Map(); /** 复用已有产生式或提取公共因子后剩余后缀的产生式 */
  rules.forEach(function (_ref2) {
    var left = _ref2.left,
      right = _ref2.right;
    commonSuffix.set(rightToString(right), left);
  });
  rules.forEach(function (_ref3) {
    var left = _ref3.left,
      right = _ref3.right;
    handleRule(left, right, new Map());
  });
  function handleRule(left, right) {
    commonSuffix.set(rightToString(right), left);
    var repeat = 0;
    var isInsertRoot = false; // 标记新产生式是否已推入 newRules
    var grammarRule = {
      left: left,
      right: []
    };
    if (right.length === 1) {
      grammarRule.right = mergeRight(right);
      newRules.push(grammarRule);
      return;
    }
    var prefix;
    var chain;
    var skips = []; // 存储已合并的项下标
    for (var i = 0; i < right.length; ++i) {
      // 以当前产生式右边为参考系
      if (skips.includes(i)) continue;
      skips.push(i);
      if (i === right.length - 1) {
        grammarRule.right.push(right[i]);
        return;
      }
      var grammar = right[i];
      var pos = 0;
      var commonGrammars = [];
      commonGrammars.push(grammar);
      prefix = '';
      setPrefix: while (pos < grammar.length) {
        // 当前产生式右边到尽头时，结束遍历
        chain = grammar[pos];
        var isEqualChain = false;
        if (pos === 0) {
          for (var j = i + 1; j < right.length; ++j) {
            var curGrammar = right[j];
            var curChain = curGrammar[pos];
            if (!curChain) continue;
            if (curChain === chain) {
              isEqualChain = true;
              skips.push(j);
              commonGrammars.push(right[j]);
            }
          }
        } else {
          for (var _j = i + 1; _j < right.length; ++_j) {
            var _curGrammar = right[_j];
            var _curChain = _curGrammar[pos];
            if (!_curChain || _curChain !== chain || !skips.includes(_j)) continue;
            isEqualChain = true;
          }
        }
        if (!isEqualChain) break setPrefix;
        prefix += chain + OR;
        pos++;
      }
      if (prefix) {
        var suffixes = commonGrammars.map(function (exp) {
          var suffix = exp.slice(prefix.slice(0, -1).split(OR).length);
          if (!suffix.length) return [EMPTY_CHAIN];
          return suffix;
        });
        var newLeft = void 0;
        if (commonSuffix.has(rightToString(suffixes))) {
          newLeft = commonSuffix.get(rightToString(suffixes));
        } else {
          newLeft = "".concat(left).concat("'".repeat(repeat), "'");
        }
        var newRight = [].concat(_toConsumableArray(prefix.slice(0, -1).split(OR)), [newLeft]);
        grammarRule.right.push(newRight);
        if (!isInsertRoot) {
          newRules.push(grammarRule);
          repeat++;
        }
        ;
        if (!commonSuffix.has(rightToString(suffixes))) handleRule(newLeft, suffixes);
      } else {
        grammarRule.right.push(_toConsumableArray(right[i]));
        if (!isInsertRoot) {
          newRules.push(grammarRule);
        }
        ;
      }
      isInsertRoot = true;
    }
  }
  return newRules;
}

/**
 * 基于 splitGrammars 方法返回的 rules 进行消除左递归
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
  var newRules = [];
  rules.forEach(function (rule) {
    newRules.push.apply(newRules, _toConsumableArray(clearDirectLeftRecursion(rule)));
  });
  function clearDirectLeftRecursion(_ref4 /** rule */) {
    var left = _ref4.left,
      right = _ref4.right;
    var rules = [];
    var newLeft = "".concat(left, "`");
    var prefixGrammars = [];
    var grammars = [];
    var isEmpty = false;
    right.forEach(function (grammar) {
      if (grammar[0] === left) {
        grammar.shift();
        grammar.push(newLeft);
        prefixGrammars.push(grammar);
      } else if (grammar[0] === EMPTY_CHAIN) {
        isEmpty = true;
      } else {
        grammar.push(newLeft);
        grammars.push(grammar);
      }
    });
    if (isEmpty) {
      grammars.push([newLeft]);
    }
    rules.push({
      left: left,
      right: [].concat(grammars)
    }, {
      left: newLeft,
      right: [].concat(prefixGrammars, [[EMPTY_CHAIN]])
    });
    return rules;
  }
  return newRules;
}
;// CONCATENATED MODULE: ./src/makeFirstSet.js




/**
  1、依次遍历所有产生式，把串首终结符加入其 FIRST 集中。
  2、如果最左串是非终结符，则把该非终结符的 FIRST 集推入到当前产生式中，如果该非终结符包含空，那么把该非终结符的 FIRST 集 - 空推入到当前产生式中，同时把该非终结符的下一个非终结符的 FIRST 集推入到当前产生式中，重复第二步直至遇到没有包含空的非终结符为止。
  3、重新遍历所有产生式，重复执行步骤 1、2，直至所有产生式均无变化。
 */
function makeFirstSet(rules, terminalSymbols) {
  var isTerminal = function isTerminal(chain) {
    return terminalSymbols.includes(chain) || chain === EMPTY_CHAIN;
  };
  var firstSet = {};
  rules.forEach(function (_ref) {
    var left = _ref.left;
    return firstSet[left] = [];
  });
  var isSetChanged;
  do {
    isSetChanged = false;
    rules.forEach(function (_ref2) {
      var left = _ref2.left,
        right = _ref2.right;
      var sets = new Set(firstSet[left]);
      var prevLength = sets.size;

      // 处理诸如 E -> A | B 的情况需要遍历
      right.forEach(function (grammar) {
        var first = 0;
        var chain = grammar[first];
        while (((_chain = chain) === null || _chain === void 0 ? void 0 : _chain[0]) === $) {
          var _chain;
          chain = grammar[++first];
        }
        if (isTerminal(chain)) sets.add(chain);else if (firstSet[chain].includes(EMPTY_CHAIN)) {
          do {
            var _firstSet$chain;
            var nextSet = new Set(firstSet[chain]);
            nextSet["delete"](EMPTY_CHAIN);
            sets = mergeSet(sets, nextSet);
            first += 1;
            chain = grammar[first];
            while (((_chain2 = chain) === null || _chain2 === void 0 ? void 0 : _chain2[0]) === $) {
              var _chain2;
              chain = grammar[++first];
            }
          } while ((_firstSet$chain = firstSet[chain]) !== null && _firstSet$chain !== void 0 && _firstSet$chain.includes(EMPTY_CHAIN));
          if (isTerminal(chain)) sets.add(chain);else if (chain) sets = mergeSet(sets, firstSet[chain]);
        } else sets = mergeSet(sets, firstSet[chain]);
      });
      firstSet[left] = _toConsumableArray(sets);
      if (prevLength !== sets.size) isSetChanged = true;
    });
  } while (isSetChanged);
  return firstSet;
}
function makeUnionFirstSet(chainSet, firstSet, terminalSymbols) {
  var isTerminal = function isTerminal(chain) {
    return terminalSymbols.includes(chain) || chain === EMPTY_CHAIN;
  };
  var unionFirstSet = [];
  chainSet.some(function (chain) {
    if (chain[0] === $) return false;
    if (isTerminal(chain)) {
      unionFirstSet.push(chain);
    } else if (!firstSet[chain].includes(EMPTY_CHAIN)) {
      unionFirstSet.push.apply(unionFirstSet, _toConsumableArray(firstSet[chain]));
    } else {
      return false;
    }
    return true;
  });
  return unionFirstSet;
}
;// CONCATENATED MODULE: ./src/makeFollowSet.js





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
function makeFollowSet(rules, terminalSymbols) {
  var firstSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : makeFirstSet(rules, terminalSymbols);
  var isTerminal = function isTerminal(chain) {
    return terminalSymbols.includes(chain) || chain === EMPTY_CHAIN;
  };
  var followSet = {};
  rules.forEach(function (_ref) {
    var left = _ref.left;
    return followSet[left] = [];
  });
  followSet[rules[0].left].push($);
  var emptySet = new Set();
  for (var tag in firstSet) firstSet[tag].includes(EMPTY_CHAIN) && emptySet.add(tag);
  var isSetChanged;
  do {
    isSetChanged = false;
    rules.forEach(function (_ref2) {
      var left = _ref2.left,
        right = _ref2.right;
      right.forEach(function (grammar) {
        for (var i = grammar.length - 1; i >= 0; --i) {
          var chain = grammar[i];
          if (isTerminal(chain) || chain[0] === $) continue;
          var prevLength = followSet[chain].length;
          if (i === grammar.length - 1) {
            followSet[chain] = _toConsumableArray(mergeSet(followSet[chain], followSet[left]));
          } else {
            var j = i + 1;
            var nextChain = grammar[j];
            while (j < grammar.length && nextChain[0] === $) {
              nextChain = grammar[++j];
            }
            if (isTerminal(nextChain)) {
              followSet[chain] = _toConsumableArray(mergeSet(followSet[chain], [nextChain]));
            } else {
              var nextSet = new Set(firstSet[nextChain]);
              nextSet["delete"](EMPTY_CHAIN);
              followSet[chain] = _toConsumableArray(mergeSet(followSet[chain], nextSet));
              while (j < grammar.length && (emptySet.has(nextChain) || nextChain[0] === $)) nextChain = grammar[++j];
              if (j === grammar.length) followSet[chain] = _toConsumableArray(mergeSet(followSet[chain], followSet[left]));
            }
          }
          if (followSet[chain].length !== prevLength) isSetChanged = true;
        }
      });
    });
  } while (isSetChanged);
  return followSet;
}
;// CONCATENATED MODULE: ./src/makeSelectSet.js

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = makeSelectSet_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function makeSelectSet_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return makeSelectSet_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return makeSelectSet_arrayLikeToArray(o, minLen); }
function makeSelectSet_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }





/**
  对于形似 A -> ab 的产生式，其 SELECT 集为 FIRST(ab)。
  对于形似 A -> null 的产生式，其 SELECT 集为 FOLLOW(A)。

  推导过程

    1、对每个产生式进行拆分，如：
    E -> id | null 拆分成 E -> id，E -> null。
    2、运用规则求出每个产生式的 SELECT 集。
 */
function makeSelectSet(rules, terminalSymbols) {
  var firstSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : makeFirstSet(rules, terminalSymbols);
  var followSet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : makeFollowSet(rules, terminalSymbols);
  var selectSet = new Map();
  rules.forEach(function (_ref) {
    var left = _ref.left,
      right = _ref.right;
    right.forEach(function (chainSet) {
      var pos = 0;
      var chain = chainSet[pos];
      var newRule = {
        left: left,
        right: chainSet
      };
      while (pos < chainSet.length && chain && chain[0] === $) {
        chain = chainSet[++pos];
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
  var map = new Map();
  var _iterator = _createForOfIteratorHelper(selectSet),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        left = _step$value[0].left,
        sets = _step$value[1];
      if (map.has(left)) {
        var prevSets = map.get(left);
        var newSets = mergeSet(prevSets, sets);
        if (newSets.size !== prevSets.size + sets.length) {
          return false;
        }
        map.set(left, newSets);
      } else {
        map.set(left, new Set(sets));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return true;
}
;// CONCATENATED MODULE: ./src/makePredictSet.js

function makePredictSet_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = makePredictSet_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function makePredictSet_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return makePredictSet_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return makePredictSet_arrayLikeToArray(o, minLen); }
function makePredictSet_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function makePredictSet(selectSet) {
  if (!isNotIntersect(selectSet)) throw new Error('Select set does not satisfy the LL(1) grammar');
  var predictSet = new Map();
  var _iterator = makePredictSet_createForOfIteratorHelper(selectSet),
    _step;
  try {
    var _loop = function _loop() {
      var _step$value = _slicedToArray(_step.value, 2),
        _step$value$ = _step$value[0],
        left = _step$value$.left,
        right = _step$value$.right,
        sets = _step$value[1];
      sets.forEach(function (chain) {
        if (!predictSet.has(chain)) predictSet.set(chain, new Map());
        var chainMap = predictSet.get(chain);
        chainMap.set(left, right);
      });
    };
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return predictSet;
}
;// CONCATENATED MODULE: ./src/index.js

function src_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = src_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function src_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return src_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return src_arrayLikeToArray(o, minLen); }
function src_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// run npx babel-node index.js






function makeLL1(grammars, terminalSymbols) {
  var rules = splitGrammars(grammars);
  var firstSet = makeFirstSet(rules, terminalSymbols);
  var followSet = makeFollowSet(rules, terminalSymbols, firstSet);
  var selectSet = makeSelectSet(rules, terminalSymbols, firstSet, followSet);
  var predictSet = makePredictSet(selectSet);
  return {
    startSymbol: rules[0].left,
    firstSet: firstSet,
    followSet: followSet,
    selectSet: selectSet,
    predictSet: predictSet,
    print: function print() {
      var leftSet = [];
      var chainSet = [];
      var indent = 2;
      var maxLength = indent;
      var _iterator = src_createForOfIteratorHelper(predictSet),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 1),
            chain = _step$value[0];
          chainSet.push(chain);
          maxLength = Math.max(maxLength, chain.length + indent);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      for (var left in firstSet) {
        leftSet.push(left);
        maxLength = Math.max(maxLength, left.length + indent);
      }
      var result = new Array(leftSet.length + 1).fill([]).map(function () {
        return new Array(chainSet.length + 1).fill('');
      });
      for (var i = 0; i < chainSet.length; ++i) {
        result[0][i + 1] = chainSet[i];
      }
      for (var _i = 0; _i < leftSet.length; ++_i) {
        result[_i + 1][0] = leftSet[_i];
      }
      var _iterator2 = src_createForOfIteratorHelper(predictSet),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            _chain = _step2$value[0],
            ruleMap = _step2$value[1];
          var col = result[0].indexOf(_chain);
          var row = void 0;
          var _iterator3 = src_createForOfIteratorHelper(ruleMap),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _step3$value = _slicedToArray(_step3.value, 2),
                _left = _step3$value[0],
                right = _step3$value[1];
              for (var _i3 = 0; _i3 < leftSet.length; ++_i3) {
                if (result[_i3 + 1][0] === _left) {
                  row = _i3 + 1;
                  break;
                }
              }
              result[row][col] = "-> ".concat(right.map(function (item) {
                return item + '';
              }).join(' '));
              maxLength = Math.max(maxLength, result[row][col].length + indent);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var colLength = maxLength + indent;
      var logStr = '';
      var splitStr = '\n' + ('|' + '-'.repeat(colLength)).repeat(chainSet.length + 1) + '|\n';
      for (var _i2 = 0; _i2 < result.length; ++_i2) {
        logStr += splitStr + '|';
        for (var j = 0; j < result[_i2].length; ++j) {
          var term = _i2 === 0 || j === 0 ? " \x1b[33;1m " + result[_i2][j] + " \x1b[0m " : " \x1b[32;1m " + result[_i2][j] + " \x1b[0m ";
          logStr += term + ' '.repeat(maxLength + 13 - term.length) + '|';
        }
      }
      logStr += splitStr;
      console.log(logStr);
    }
  };
}

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=ll1.js.map