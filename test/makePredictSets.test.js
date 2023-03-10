import { makeSelectSet } from '../src/makeSelectSet'
import { makePredictSet } from '../src/makePredictSet'
import { splitGrammars } from '../src/splitGrammars'
import { $, EMPTY_CHAIN } from '../src/constants'

describe('test makePredictSets.js', () => {
  test('grammar', () => {
    const rules1 = splitGrammars([
      'E -> $$$$ T E1',
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
            ['E', ['$$$$', 'T', 'E1']],
            ['T', ['F', 'T1']],
            ['F', ['(', 'E', ')']]
          ])
        ],
        [
          'id',
          new Map([
            ['E', ['$$$$', 'T', 'E1']],
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
            ['T1', ['*', 'F', 'T1']]
          ])
        ]
      ])
    )
  })

  test('error', () => {
    const rules1 = splitGrammars([
      'A -> B C | +',
      'B -> +',
      'C -> id'
    ])

    const selectSet1 = makeSelectSet(rules1, ['+', 'id'])
    expect(() => makePredictSet(selectSet1)).toThrow(Error)
  })
})