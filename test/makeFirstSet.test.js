import { makeFirstSet, makeUnionFirstSet } from '../src/makeFirstSet'
import { splitGrammars } from '../src/splitGrammars'
import { EMPTY_CHAIN } from '../src/constants'

describe('test makeFirstSet.js', () => {
  test('single grammar', () => {
    const rules = splitGrammars(['E -> ( id ) | null'])

    const firstSet = makeFirstSet(rules, ['(', 'id', ')'])
    expect(firstSet).toEqual({
      'E': ['(', EMPTY_CHAIN]
    })
  })

  test('grammars', () => {
    const rules1 = splitGrammars([
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ])

    const firstSet1 = makeFirstSet(rules1, ['+', '*', '(', 'id', ')'])
    expect(firstSet1).toEqual({
      'E': ['(', 'id'],
      'E1': ['+', EMPTY_CHAIN],
      'T': ['(', 'id'],
      'T1': ['*', EMPTY_CHAIN],
      'F': ['(', 'id']
    })

    const rules2 = splitGrammars([
      'E -> T E1',
      'E1 -> + E | null',
      'T -> F T1',
      'T1 -> T | null',
      'F -> P F1',
      'F1 -> * F1 | null',
      'P -> ( E ) | a | b | ^'
    ])

    const firstSet2 = makeFirstSet(rules2, ['+', '*', '(', ')', 'a', 'b', '^'])
    expect(firstSet2).toEqual({
      'E': ['(', 'a', 'b', '^'],
      'E1': ['+', EMPTY_CHAIN],
      'T': ['(', 'a', 'b', '^'],
      'T1': [EMPTY_CHAIN, '(', 'a', 'b', '^'],
      'F': ['(', 'a', 'b', '^'],
      'F1': ['*', EMPTY_CHAIN],
      'P': ['(', 'a', 'b', '^']
    })
  })

  test('first nonterminal include empty chain', () => {
    const rules1 = splitGrammars([
      'A -> B C', // { +, id }
      'B -> D | null', // { null, id }
      'C -> +', // { + }
      'D -> id' // { id }
    ])

    const firstSet1 = makeFirstSet(rules1, ['+', 'id'])
    expect(firstSet1).toEqual({
      'A': ['+', 'id'],
      'B': [EMPTY_CHAIN, 'id'],
      'C': ['+'],
      'D': ['id'],
    })

    const rules2 = splitGrammars([
      'A -> B C E', // { +, *, id }
      'B -> D | null', // { null, id }
      'C -> + | null', // { +, null }
      'D -> id', // { id }
      'E -> *' // { * }
    ])

    const firstSet2 = makeFirstSet(rules2, ['+', 'id', '*'])
    expect(firstSet2).toEqual({
      'A': ['+', '*', 'id'],
      'B': [EMPTY_CHAIN, 'id'],
      'C': ['+', EMPTY_CHAIN],
      'D': ['id'],
      'E': ['*']
    })

    const rules3 = splitGrammars([
      'A -> $ B $ + $ C $ E', // { +, id }
      'B -> D $ | null', // { null, id }
      'C -> $ + | null', // { +, null }
      'D -> id $', // { id }
      'E -> * $ $ $' // { * }
    ])

    const firstSet3 = makeFirstSet(rules3, ['+', 'id', '*'])
    expect(firstSet3).toEqual({
      'A': ['+', 'id'],
      'B': [EMPTY_CHAIN, 'id'],
      'C': ['+', EMPTY_CHAIN],
      'D': ['id'],
      'E': ['*']
    })
  })

  test('unionFirstSet', () => {
    const terminalSymbols = ['(', 'id', '+']

    const chainSet1 = ['$', 'T', 'E1', '$', '$']
    const firstSet1 = {
      'T': ['(', 'id'],
      'E1': ['+', EMPTY_CHAIN]
    }

    expect(makeUnionFirstSet(chainSet1, firstSet1, terminalSymbols)).toEqual(
      firstSet1['T']
    )

    const chainSet2 = ['+', 'T']
    const firstSet2 = {
      'T': ['(', 'id']
    }

    expect(makeUnionFirstSet(chainSet2, firstSet2, terminalSymbols)).toEqual(
      ['+']
    )

    const chainSet3 = ['A', 'B', 'C']
    const firstSet3 = {
      'A': ['+', EMPTY_CHAIN],
      'B': ['id', EMPTY_CHAIN],
      'C': ['+']
    }

    expect(makeUnionFirstSet(chainSet3, firstSet3, terminalSymbols)).toEqual(
      firstSet3['C']
    )

    const chainSet4 = ['A', 'B', '(', 'C']
    const firstSet4 = {
      'A': ['+', EMPTY_CHAIN],
      'B': ['id', EMPTY_CHAIN],
      'C': ['+']
    }

    expect(makeUnionFirstSet(chainSet4, firstSet4, terminalSymbols)).toEqual(
      ['(']
    )
  })
})
