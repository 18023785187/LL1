# 编译原理 LL(1) 文法

根据产生式求取 First、Follow、Select 集。

```javascript
const exp = 'E -> ( id ) | null'

const rules = splitExpressions(exp)
/**
      [
        {
          left: 'E',
          right: [
            ['(', 'id', ')'],
            [null]
          ]
        }
      ]
 */

firstSet = makeFirstSet(rules, ['(', 'id', ')'])
/**
    {
      'E': ['(', null]
    }
 */
```