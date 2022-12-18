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