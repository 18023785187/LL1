const makeFirstSet = require('../src/makeFirstSet')
const splitExpressions = require('../src/splitExpressions')

describe('test makeFirstSet.js', () => {
  test('single expression', () => {
    const rules = splitExpressions(['E -> ( id ) | null'])

    const firstSet = makeFirstSet(rules, ['(', 'id', ')'])
    expect(firstSet).toEqual({
      'E': ['(', null]
    })
  })

  test('expressions', () => {
    const rules = splitExpressions([
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ])

    const firstSet = makeFirstSet(rules, ['+', '*', '(', 'id', ')'])
    expect(firstSet).toEqual({
      'E': ['(', 'id'],
      'E1': ['+', null],
      'T': ['(', 'id'],
      'T1': ['*', null],
      'F': ['(', 'id']
    })
  })

  test('first nonterminal include empty chain', () => {
    const rules1 = splitExpressions([
      'A -> B C', // { +, id }
      'B -> D | null', // { null, id }
      'C -> +', // { + }
      'D -> id' // { id }
    ])

    const firstSet1 = makeFirstSet(rules1, ['+', 'id'])
    expect(firstSet1).toEqual({
      'A': ['+', 'id'],
      'B': [null, 'id'],
      'C': ['+'],
      'D': ['id'],
    })

    const rules2 = splitExpressions([
      'A -> B C E', // { +, *, id }
      'B -> D | null', // { null, id }
      'C -> + | null', // { +, null }
      'D -> id', // { id }
      'E -> *' // { * }
    ])

    const firstSet2 = makeFirstSet(rules2, ['+', 'id', '*'])
    expect(firstSet2).toEqual({
      'A': ['+', '*', 'id'],
      'B': [null, 'id'],
      'C': ['+', null],
      'D': ['id'],
      'E': ['*']
    })

    const rules3 = splitExpressions([
      'A -> B + C E', // { +, id }
      'B -> D | null', // { null, id }
      'C -> + | null', // { +, null }
      'D -> id', // { id }
      'E -> *' // { * }
    ])

    const firstSet3 = makeFirstSet(rules3, ['+', 'id', '*'])
    expect(firstSet3).toEqual({
      'A': ['+', 'id'],
      'B': [null, 'id'],
      'C': ['+', null],
      'D': ['id'],
      'E': ['*']
    })
  })
})
