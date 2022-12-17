const splitExpressions = require('../src/splitExpressions')

describe('test splitExpressions.js', () => {
  test('single expression', () => {
    const rules = ['E -> ( id ) | null']

    const expressions = splitExpressions(rules)
    expect(expressions).toEqual(
      [
        {
          left: 'E',
          right: [
            ['(', 'id', ')'],
            [null]
          ]
        }
      ]
    )
  })

  test('not right', () => {
    const rules = ['E -> ']

    expect(() => splitExpressions(rules)).toThrow(Error)
  })

  test('expressions', () => {
    const rules1 = [
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ]

    const expressions1 = splitExpressions(rules1)
    expect(expressions1).toEqual(
      [
        {
          left: 'E',
          right: [['T', 'E1']]
        },
        {
          left: 'E1',
          right: [['+', 'T', 'E1'], [null]]
        },
        {
          left: 'T',
          right: [['F', 'T1']]
        },
        {
          left: 'T1',
          right: [['*', 'F', 'T1'], [null]]
        },
        {
          left: 'F',
          right: [['(', 'E', ')'], ['id']]
        }
      ]
    )

    const rules2 = [
      'A -> B C',
      'B -> D | null',
      'C -> +',
      'D -> id'
    ]

    const expressions2 = splitExpressions(rules2)
    expect(expressions2).toEqual(
      [
        {
          left: 'A',
          right: [['B', 'C']]
        },
        {
          left: 'B',
          right: [['D'], [null]]
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