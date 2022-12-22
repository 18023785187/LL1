const { makeSelectSet, isNotIntersect } = require('../src/makeSelectSet')
const { splitExpressions } = require('../src/splitExpressions')
const { $, EMPTY_CHAIN } = require('../src/constants')

describe('test makeSelectSet.js', () => {
  test('expression', () => {
    const rules1 = splitExpressions([
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ])

    const selectSet1 = makeSelectSet(rules1, ['+', '*', '(', 'id', ')'])
    expect(selectSet1).toEqual(
      new Map([
        [
          { left: 'E', right: ['T', 'E1'] },
          ['(', 'id']
        ],
        [
          { left: 'E1', right: ['+', 'T', 'E1'] },
          ['+']
        ],
        [
          { left: 'E1', right: [EMPTY_CHAIN] },
          [$, ')']
        ],
        [
          { left: 'T', right: ['F', 'T1'] },
          ['(', 'id']
        ],
        [
          { left: 'T1', right: ['*', 'F', 'T1'] },
          ['*']
        ],
        [
          { left: 'T1', right: [EMPTY_CHAIN] },
          ['+', $, ')']]
        ,
        [
          { left: 'F', right: ['(', 'E', ')'] },
          ['(']
        ],
        [
          { left: 'F', right: ['id'] },
          ['id']
        ]
      ])
    )

    const rules2 = splitExpressions([
      'E -> T E1',
      'E1 -> A T E1 | null',
      'T -> F T1',
      'T1 -> M F T1 | null',
      'F -> ( E ) | id',
      'A -> + | -',
      'M -> * | /'
    ])

    const selectSet2 = makeSelectSet(rules2, ['+', '-', '*', '/', '(', 'id', ')'])
    expect(selectSet2).toEqual(
      new Map([
        [
          { left: 'E', right: ['T', 'E1'] },
          ['(', 'id']
        ],
        [
          { left: 'E1', right: ['A', 'T', 'E1'] },
          ['+', '-']
        ],
        [
          { left: 'E1', right: [EMPTY_CHAIN] },
          [$, ')']
        ],
        [
          { left: 'T', right: ['F', 'T1'] },
          ['(', 'id']
        ],
        [
          { left: 'T1', right: ['M', 'F', 'T1'] },
          ['*', '/']
        ],
        [
          { left: 'T1', right: [EMPTY_CHAIN] },
          ['+', '-', $, ')']]
        ,
        [
          { left: 'F', right: ['(', 'E', ')'] },
          ['(']
        ],
        [
          { left: 'F', right: ['id'] },
          ['id']
        ],
        [
          { left: 'A', right: ['+'] },
          ['+']
        ],
        [
          { left: 'A', right: ['-'] },
          ['-']
        ],
        [
          { left: 'M', right: ['*'] },
          ['*']
        ],
        [
          { left: 'M', right: ['/'] },
          ['/']
        ]
      ])
    )
  })

  test('isNotIntersect', () => {
    const rules1 = splitExpressions([
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ])

    const selectSet1 = makeSelectSet(rules1, ['+', '*', '(', 'id', ')'])
    expect(isNotIntersect(selectSet1)).toBeTruthy()

    const rules2 = splitExpressions([
      'E -> T E1',
      'E1 -> A T E1 | null',
      'T -> F T1',
      'T1 -> M F T1 | null',
      'F -> ( E ) | id',
      'A -> + | -',
      'M -> * | /'
    ])

    const selectSet2 = makeSelectSet(rules2, ['+', '-', '*', '/', '(', 'id', ')'])
    expect(isNotIntersect(selectSet2)).toBeTruthy()

    const rules3 = splitExpressions([
      'A -> B C | +',
      'B -> +',
      'C -> id'
    ])

    const selectSet3 = makeSelectSet(rules3, ['+', 'id'])
    expect(isNotIntersect(selectSet3)).toBeFalsy()
  })
})