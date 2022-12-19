const { makeLL1 } = require('../src')
const { EMPTY_CHAIN, $ } = require('../src/contants')

describe('test index.js', () => {
  test('makeLL1', () => {
    const expressions = [
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ]
    const terminalSymbols = ['+', '*', '(', 'id', ')']

    const ll1 = makeLL1(expressions, terminalSymbols)

    expect(ll1.firstSet).toEqual({
      'E': ['(', 'id'],
      'E1': ['+', EMPTY_CHAIN],
      'T': ['(', 'id'],
      'T1': ['*', EMPTY_CHAIN],
      'F': ['(', 'id']
    })

    expect(ll1.followSet).toEqual({
      'E': [$, ')'],
      'E1': [$, ')'],
      'T': ['+', $, ')'],
      'T1': ['+', $, ')'],
      'F': ['*', '+', $, ')']
    })

    expect(ll1.selectSet).toEqual(
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

    expect(ll1.predictSet).toEqual(
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

  test('print', () => {
    const expressions = [
      'E -> T E1', 
      'E1 -> A T E1',
      'E1 -> null',
      'T -> F T1',
      'T1 -> M F T1',
      'T1 -> null',
      'F -> ( E )',
      'F -> id',
      'A -> +',
      'A -> -',
      'M -> *',
      'M -> /'
    ]
    const terminalSymbols = ['+', '-', '*', '/', '(', 'id', ')']

    const ll1 = makeLL1(expressions, terminalSymbols)
    ll1.print()
  })
})