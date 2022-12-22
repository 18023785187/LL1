# 编译原理 LL(1) 文法

根据产生式求取 First、Follow、Select 集和预测分析表，附带一系列应用例子。

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

## 说明

#### 类型

重要的输入为产生式 `expressions` 和终结符 `terminalSymbols`，产生式和终结符由一维字符串数组组成。

`expressions` 规定以空格为分割单元，| 带有或的含义，以 \$ 为前缀命名的串为该处执行函数，用于对生成的 AST 进行整合，对于终结符则不需要 \$。

`terminalSymbols` 指定终结符集合，规定终结符不能是 `null、|、$`，其中 null 表示空串。

#### 例子

对于下面加法表达式文法(1+2+...+3，其中 + id 为终结符)

  E -> id E1
  E1 -> +id E1 | null

expressions 对应的书写格式为：

```javascript
const expressions = [
  'E -> id E1',
  'E1 -> + id E1 | null'
]
```

或

```javascript
const expressions = [
  'E -> id E1',
  'E1 -> + id E1',
  'E1 -> null'
]
```

对于生成 AST 的过程我们可以在产生式中插入辅助函数标识，以 $ 开头

```javascript
const expressions = [
  'E -> id E1',
  'E1 -> + id $mergeExp E1',
  'E1 -> null'
]
```

对于终结符则不需在产生式中插入辅助函数标识，具体用法可以查看 `./example` 目录下的任意例子，在目录下运行 `npm index.js` 即可。

#### 类型表

```typescript
type EMPTY_CHAIN = null
type $ = '$'

type expressions = string[]

type terminalSymbols = string[]

type right = (string | EMPTY_CHAIN)[][]
type $Set = (string | $)[][]

type rule = {
  left: string,
  right: right
}

type rules = rule[]

type firstSet = {
  [k: string]: right
}

type followSet = {
  [k: string]: $Set
}

type selectSet = Map<rule, string[][] | followSet>

type predictSet = Map<string, Map<left, right>>
```

## API

###### makeLL1(expressions, terminalSymbols)

  根据产生式和指定终止符返回 startSymbol, firstSet, followSet, selectSet, predictSet 和 print 方法。
  其中 startSymbol 为产生式集的起始符。

###### splitExpressions(expressions)

  根据产生式生成 rules 数组。

###### toExpressions(rules, isExpand = false)

  把 rules 数组转换成产生式字符串数组，isExpand 参数为是否展开表达式，即把或拆分出来。

###### combineLikeTerms(rules)

  配合 splitExpressions 使用，提取公共因子（注意：不能在产生式中插入辅助函数标识）。

###### clearLeftRecursion(rules) （未完成，目前只能消除直接左递归）

  配合 splitExpressions 使用，消除左递归（注意：不能在产生式中插入辅助函数标识）。

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
  