const splitExpressions = require('../src/splitExpressions')
const { EMPTY_CHAIN } = require('../src/contants')

describe('test splitExpressions.js', () => {
  test('single expression', () => {
    const expressions = ['E -> ( id ) | null']

    const rules = splitExpressions(expressions)
    expect(rules).toEqual(
      [
        {
          left: 'E',
          right: [
            ['(', 'id', ')'],
            [EMPTY_CHAIN]
          ]
        }
      ]
    )
  })

  test('not right', () => {
    const expressions = ['E -> ']

    expect(() => splitExpressions(expressions)).toThrow(Error)
  })

  test('expressions', () => {
    const expressions1 = [
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ]

    const rules1 = splitExpressions(expressions1)
    expect(rules1).toEqual(
      [
        {
          left: 'E',
          right: [['T', 'E1']]
        },
        {
          left: 'E1',
          right: [['+', 'T', 'E1'], [EMPTY_CHAIN]]
        },
        {
          left: 'T',
          right: [['F', 'T1']]
        },
        {
          left: 'T1',
          right: [['*', 'F', 'T1'], [EMPTY_CHAIN]]
        },
        {
          left: 'F',
          right: [['(', 'E', ')'], ['id']]
        }
      ]
    )

    const expressions2 = [
      'A -> B C',
      'B -> D | null',
      'C -> +',
      'D -> id'
    ]

    const rules2 = splitExpressions(expressions2)
    expect(rules2).toEqual(
      [
        {
          left: 'A',
          right: [['B', 'C']]
        },
        {
          left: 'B',
          right: [['D'], [EMPTY_CHAIN]]
        },
        {
          left: 'C',
          right: [['+']]
        },
        {
          left: 'D',
          right: [['id']]
        }
      ]
    )
  })
})