const { makeFollowSet } = require('../src/makeFollowSet')
const { splitExpressions } = require('../src/splitExpressions')
const { $ } = require('../src/constants')

describe('test makeFollowSet.js', () => {
  test('single expression', () => {
    const rules = splitExpressions(['E -> ( id ) | null'])

    const followSet = makeFollowSet(rules, ['(', 'id', ')'])
    expect(followSet).toEqual({
      'E': [$]
    })
  })

  test('expressions', () => {
    const rules1 = splitExpressions([
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ])

    const followSet1 = makeFollowSet(rules1, ['+', '*', '(', 'id', ')'])
    expect(followSet1).toEqual({
      'E': [$, ')'],
      'E1': [$, ')'],
      'T': ['+', $, ')'],
      'T1': ['+', $, ')'],
      'F': ['*', '+', $, ')']
    })

    const rules2 = splitExpressions([
      'A -> $ B $ C',
      'B -> D $ $ | null',
      'C -> $ $ +',
      'D -> $ id'
    ])

    const followSet2 = makeFollowSet(rules2, ['+', 'id'])
    expect(followSet2).toEqual({
      'A': [$],
      'B': ['+'],
      'C': [$],
      'D': ['+'],
    })

    const rules3 = splitExpressions([
      'E -> $ $ $ T $ $ E1 $ $',
      'E1 -> $ $$ $$$ + $ $$ $$$  E | null',
      'T -> $ $$ $$$ F $ $$ $$$  T1',
      'T1 -> $ $$ $$$ T | null',
      'F -> $ $$ $$$ P $ $$ $$$  F1',
      'F1 -> $ $$ $$$ * $ $$ $$$  F1 | null',
      'P -> $ $$ $$$ ( $ $$ $$$ E $ $$ $$$ ) $ $$ $$$ | $ $$ $$$ a $ $$ $$$ | $ $$ $$$ b $ $$ $$$ | $ $$ $$$ ^ $ $$ $$$'
    ])

    const followSet3 = makeFollowSet(rules3, ['+', '*', '(', ')', 'a', 'b', '^'])
    expect(followSet3).toEqual({
      'E': [$, ')'],
      'E1': [$, ')'],
      'T': ['+', $, ')'],
      'T1': ['+', $, ')'],
      'F': ['(', 'a', 'b', '^', '+', $, ')'],
      'F1': ['(', 'a', 'b', '^', '+', $, ')'],
      'P': ['*', '(', 'a', 'b', '^', '+', $, ')']
    })
  })
})