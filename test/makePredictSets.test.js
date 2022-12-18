const { makeSelectSet } = require('../src/makeSelectSet')
const { makePredictSet } = require('../src/makePredictSet')
const splitExpressions = require('../src/splitExpressions')
const { $, EMPTY_CHAIN } = require('../src/contants')

describe('test makePredictSets.js', () => {
  test('expression', () => {
    const rules1 = splitExpressions([
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ])

    const selectSet1 = makeSelectSet(rules1, ['+', '*', '(', 'id', ')'])
    expect(makePredictSet(selectSet1)).toEqual(
      new Map([
        [
          '(',
          new Map([
            ['E', ['T', 'E1']],
            ['T', ['F', 'T1']],
            ['F', ['(', 'E', ')']]
          ])
        ],
        [
          'id',
          new Map([
            ['E', ['T', 'E1']],
            ['T', ['F', 'T1']],
            ['F', ['id']]
          ])
        ],
        [
          '+',
          new Map([
            ['E1', ['+', 'T', 'E1']],
            ['T1', [EMPTY_CHAIN]]
          ])
        ],
        [
          $,
          new Map([
            ['E1', [EMPTY_CHAIN]],
            ['T1', [EMPTY_CHAIN]]
          ])
        ],
        [
          ')',
          new Map([
            ['E1', [EMPTY_CHAIN]],
            ['T1', [EMPTY_CHAIN]]
          ])
        ],
        [
          '*',
          new Map([
            ['T1', [ '*', 'F', 'T1' ]]
          ])
        ]
      ])
    )
  })

  test('error', () => {
    const rules1 = splitExpressions([
      'A -> B C | +',
      'B -> +',
      'C -> id'
    ])

    const selectSet1 = makeSelectSet(rules1, ['+', 'id'])
    expect(() => makePredictSet(selectSet1)).toThrow(Error)
  })
})