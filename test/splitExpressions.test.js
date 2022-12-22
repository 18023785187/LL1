const { splitExpressions, toExpressions, combineLikeTerms, clearLeftRecursion } = require('../src/splitExpressions');
const { EMPTY_CHAIN } = require('../src/constants');

describe('test splitExpressions.js', () => {
  test('single expression', () => {
    const expressions1 = ['E -> ( id ) | null'];

    const rules1 = splitExpressions(expressions1);
    expect(rules1).toEqual(
      [
        {
          left: 'E',
          right: [
            ['(', 'id', ')'],
            [EMPTY_CHAIN]
          ]
        }
      ]
    );

    const expressions2 = ['E -> a A | + | a c A | a c B'];

    const rules2 = splitExpressions(expressions2);
    expect(combineLikeTerms(rules2)).toEqual(
      [
        {
          left: 'E',
          right: [
            ['a', `E'`],
            ['+']
          ]
        },
        {
          left: `E'`,
          right: [
            ['A'],
            ['c', `E''`]
          ]
        },
        {
          left: `E''`,
          right: [
            ['A'],
            ['B']
          ]
        }
      ]
    );

    const expressions3 = ['E -> + a | + b | * c | * d | y'];

    const rules3 = splitExpressions(expressions3);
    expect(combineLikeTerms(rules3)).toEqual(
      [
        {
          left: 'E',
          right: [
            ['+', `E'`],
            ['*', `E''`],
            ['y']
          ]
        },
        {
          left: `E'`,
          right: [
            ['a'],
            ['b']
          ]
        },
        {
          left: `E''`,
          right: [
            ['c'],
            ['d']
          ]
        }
      ]
    );

    const expressions4 = ['E -> a b A |  a b B'];

    const rules4 = splitExpressions(expressions4);
    expect(combineLikeTerms(rules4)).toEqual(
      [
        {
          left: 'E',
          right: [
            ['a', 'b', `E'`]
          ]
        },
        {
          left: `E'`,
          right: [
            ['A'],
            ['B']
          ]
        }
      ]
    );

    const expressions5 = ['E -> a b A |  a b'];

    const rules5 = splitExpressions(expressions5);
    expect(combineLikeTerms(rules5)).toEqual(
      [
        {
          left: 'E',
          right: [
            ['a', 'b', `E'`]
          ]
        },
        {
          left: `E'`,
          right: [
            ['A'],
            [EMPTY_CHAIN]
          ]
        }
      ]
    );

    const expressions6 = ['E -> a A | a B | b A | b B'];

    const rules6 = splitExpressions(expressions6);
    expect(combineLikeTerms(rules6)).toEqual(
      [
        {
          left: 'E',
          right: [
            ['a', `E'`],
            ['b', `E'`]
          ]
        },
        {
          left: `E'`,
          right: [
            ['A'],
            ['B']
          ]
        }
      ]
    );

    const expressions7 = ['S -> a A c | a B d | c C | d'];

    const rules7 = splitExpressions(expressions7);
    expect(combineLikeTerms(rules7)).toEqual(
      [
        {
          left: 'S',
          right: [
            ['a', `S'`],
            ['c', 'C'],
            ['d']
          ]
        },
        {
          left: `S'`,
          right: [
            ['A', 'c'],
            ['B', 'd']
          ]
        }
      ]
    );

    const expressions8 = ['S -> a a B | a a a C | a a a D'];

    const rules8 = splitExpressions(expressions8);
    expect(combineLikeTerms(rules8)).toEqual(
      [
        {
          left: 'S',
          right: [
            ['a', 'a', `S'`],
          ]
        },
        {
          left: `S'`,
          right: [
            ['B'],
            ['a', `S''`]
          ]
        },
        {
          left: `S''`,
          right: [
            ['C'],
            ['D']
          ]
        }
      ]
    );

    const expressions9 = ['G -> G r | G apple | time | good | a | have'];

    const rules9 = splitExpressions(expressions9);
    expect(toExpressions(clearLeftRecursion(rules9))).toEqual(
      [
        'G -> time G` | good G` | a G` | have G`',
        'G` -> r G` | apple G` | null'
      ]
    );

    const expressions10 = ['A -> A c | A a d | b d | null'];

    const rules10 = splitExpressions(expressions10);
    expect(toExpressions(clearLeftRecursion(rules10))).toEqual(
      [
        'A -> b d A` | A`',
        'A` -> c A` | a d A` | null'
      ]
    );

    const expressions11 = ['E -> E + T | T'];

    const rules11 = splitExpressions(expressions11);
    expect(toExpressions(clearLeftRecursion(rules11))).toEqual(
      [
        'E -> T E`',
        'E` -> + T E` | null'
      ]
    );

    const expressions12 = ['A -> A + | A * | A / | null'];

    const rules12 = splitExpressions(expressions12);
    expect(toExpressions(clearLeftRecursion(rules12))).toEqual(
      [
        'A -> A`',
        'A` -> + A` | * A` | / A` | null'
      ]
    );
  });

  test('not right', () => {
    const expressions = ['E -> '];

    expect(() => splitExpressions(expressions)).toThrow(Error);
  });

  test('toExpressions', () => {
    const expressions1 = [
      'E -> a A | + | a b B | a b C',
      'D -> B | C',
    ];

    const rules1 = splitExpressions(expressions1);
    expect(toExpressions(rules1)).toEqual(expressions1);

    const expressions2 = [
      'E -> a A | + | a b B | a b C',
      'D -> B | C',
    ];

    const rules2 = splitExpressions(expressions2);
    expect(toExpressions(rules2, true)).toEqual([
      'E -> a A',
      'E -> +',
      'E -> a b B',
      'E -> a b C',
      'D -> B',
      'D -> C'
    ]);

    const expressions3 = [
      'E -> null'
    ];

    const rules3 = splitExpressions(expressions3);
    expect(toExpressions(rules3)).toEqual(expressions3);
  });

  test('expressions', () => {
    const expressions1 = [
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ];

    const rules1 = splitExpressions(expressions1);
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
    );

    const expressions2 = [
      'A -> B C',
      'B -> D | null',
      'C -> +',
      'D -> id'
    ];

    const rules2 = splitExpressions(expressions2);
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
    );

    const expressions3 = [
      'A -> id',
      'A -> null'
    ];

    const rules3 = splitExpressions(expressions3);
    expect(rules3).toEqual(
      [
        {
          left: 'A',
          right: [['id'], [null]]
        }
      ]
    );

    const expressions4 = [
      'E -> T E1',
      'E1 -> + T E1',
      'E1 -> null',
      'T -> F T1',
      'T1 -> * F T1',
      'T1 -> null',
      'F -> ( E )',
      'F -> id'
    ];

    const rules4 = splitExpressions(expressions4);
    expect(rules4).toEqual(
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
    );

    const expressions5 = [
      'S -> ( T ) | a + S | a',
      'T -> S T1',
      'T1 -> , S T1 | null'
    ];

    const rules5 = splitExpressions(expressions5);
    expect(combineLikeTerms(rules5)).toEqual(
      [
        {
          left: 'S',
          right: [
            ['(', 'T', ')'],
            ['a', `S'`]
          ]
        },
        {
          left: `S'`,
          right: [
            ['+', 'S'],
            [EMPTY_CHAIN]
          ]
        },
        {
          left: 'T',
          right: [
            ['S', 'T1']
          ]
        },
        {
          left: 'T1',
          right: [
            [',', 'S', 'T1'],
            [EMPTY_CHAIN]
          ]
        }
      ]
    );

    const expressions6 = [
      'S -> a F S1 | * a F S1',
      'S1 -> * a F S1 | null',
      'F -> + a F | + a'
    ];

    const rules6 = splitExpressions(expressions6);
    expect(combineLikeTerms(rules6)).toEqual(
      [
        {
          left: 'S',
          right: [
            ['a', 'F', 'S1'],
            ['*', 'a', 'F', 'S1']
          ]
        },
        {
          left: 'S1',
          right: [
            ['*', 'a', 'F', 'S1'],
            [EMPTY_CHAIN]
          ]
        },
        {
          left: 'F',
          right: [
            ['+', 'a', `F'`]
          ]
        },
        {
          left: `F'`,
          right: [
            ['F'],
            [EMPTY_CHAIN]
          ]
        }
      ]
    );

    const expressions7 = [
      'S -> a S b',
      'S -> a S',
      'S -> null'
    ];

    const rules7 = splitExpressions(expressions7);
    expect(combineLikeTerms(rules7)).toEqual(
      [
        {
          left: 'S',
          right: [
            ['a', 'S', `S'`],
            [null]
          ]
        },
        {
          left: `S'`,
          right: [
            ['b'],
            [EMPTY_CHAIN]
          ]
        }
      ]
    );
  });

  test('all', () => {
    const expressions1 = [
      'Exp -> , A | + | , b77 ; | , b77 C',
      'D -> ; | C',
    ];

    const rules1 = splitExpressions(expressions1);
    expect(toExpressions(combineLikeTerms(rules1))).toEqual([
      "Exp -> , Exp' | +",
      "Exp' -> A | b77 D",
      'D -> ; | C'
    ]);

    const expressions2 = [
      'E -> a A | a B | b A B | b C D',
      'F -> A | B',
      'G -> A B | C D'
    ];

    const rules2 = splitExpressions(expressions2);
    expect(toExpressions(combineLikeTerms(rules2))).toEqual([
      "E -> a F | b G",
      'F -> A | B',
      'G -> A B | C D'
    ]);

    const expressions3 = [
      'E -> a b A | a b B',
      'C -> A | B'
    ];

    const rules3 = splitExpressions(expressions3);
    expect(toExpressions(combineLikeTerms(rules3))).toEqual([
      "E -> a b C",
      'C -> A | B'
    ]);

    const expressions4 = [
      'E -> a b A | a b B',
    ];

    const rules4 = splitExpressions(expressions4);
    expect(toExpressions(combineLikeTerms(rules4))).toEqual([
      "E -> a b E'",
      "E' -> A | B"
    ]);

    const expressions5 = [
      'Exp -> a Ax | a By | b Ax | b By',
      'Type -> Ax | By'
    ];

    const rules5 = splitExpressions(expressions5);
    expect(toExpressions(combineLikeTerms(rules5))).toEqual([
      "Exp -> a Type | b Type",
      'Type -> Ax | By'
    ]);
  });
});
