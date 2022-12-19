# 编译原理 LL(1) 文法

根据产生式求取 First、Follow、Select 集和预测分析表。

```javascript
const expressions = [ // 书写产生式是规定空格为分隔符，null 为空串
  'E -> T E1',
  'E1 -> + T E1 | null',
  'T -> F T1',
  'T1 -> * F T1 | null',
  'F -> ( E ) | id'
]
const terminalSymbols = ['+', '*', '(', 'id', ')'] // 指定终止符

/**
  返回 firstSet, followSet, selectSet, predictSet 和 print 方法
 */
const ll1 = makeLL1(expressions, terminalSymbols)
ll1.print()

// print
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|             |  (          |  id         |  +          |  $          |  )          |  *          |
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|  E          |  -> T E1    |  -> T E1    |             |             |             |             |
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|  E1         |             |             |  -> + T E1  |  -> null    |  -> null    |             |
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|  T          |  -> F T1    |  -> F T1    |             |             |             |             |
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|  T1         |             |             |  -> null    |  -> null    |  -> null    |  -> * F T1  |
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
|  F          |  -> ( E )   |  -> id      |             |             |             |             |
|-------------|-------------|-------------|-------------|-------------|-------------|-------------|
```

#### API

###### makeLL1(expressions, terminalSymbols)

  根据产生式和指定终止符返回 firstSet, followSet, selectSet, predictSet 和 print 方法。

###### splitExpressions(expressions)

  根据产生式生成 rules 数组。

###### combineLikeTerms(rules)

  配合 splitExpressions 使用，提取公共因子。

###### makeFirstSet(rules, terminalSymbols)

  生成 first 集。

###### makeUnionFirstSet(chainSet, firstSet, terminalSymbols)

  求解多个 first 集并集。

###### makeFollowSet(rules, terminalSymbols, firstSet?)

  生成 followSet 集，如果不传入 firstSet 参数将自动根据 rules、terminalSymbols 生成 first 集。

###### makeSelectSet(rules, terminalSymbols, firstSet?, follow?)

  生成 followSet 集，如果不传入 firstSet、follow 参数将自动根据 rules、terminalSymbols 生成 first、follow 集。

###### isNotIntersect(selectSet)

  给定 select 集判断该 select 集是否没有交集。

###### makePredictSet(selectSet)

  生成预测分析表。

###### EMPTY_CHAIN

  空集常数。

###### $

  终止符常数。
  