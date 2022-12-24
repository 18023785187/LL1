const { splitGrammars, toGrammars, combineLikeTerms, clearLeftRecursion } = require('../src/splitGrammars');
const { EMPTY_CHAIN } = require('../src/constants');

describe('test splitGrammars.js', () => {
  test('single grammar', () => {
    const grammars1 = ['E -> ( id ) | null'];

    const rules1 = splitGrammars(grammars1);
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

    const grammars2 = ['E -> a A | + | a c A | a c B'];

    const rules2 = splitGrammars(grammars2);
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

    const grammars3 = ['E -> + a | + b | * c | * d | y'];

    const rules3 = splitGrammars(grammars3);
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

    const grammars4 = ['E -> a b A |  a b B'];

    const rules4 = splitGrammars(grammars4);
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

    const grammars5 = ['E -> a b A |  a b'];

    const rules5 = splitGrammars(grammars5);
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

    const grammars6 = ['E -> a A | a B | b A | b B'];

    const rules6 = splitGrammars(grammars6);
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

    const grammars7 = ['S -> a A c | a B d | c C | d'];

    const rules7 = splitGrammars(grammars7);
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

    const grammars8 = ['S -> a a B | a a a C | a a a D'];

    const rules8 = splitGrammars(grammars8);
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

    const grammars9 = ['G -> G r | G apple | time | good | a | have'];

    const rules9 = splitGrammars(grammars9);
    expect(toGrammars(clearLeftRecursion(rules9))).toEqual(
      [
        'G -> time G` | good G` | a G` | have G`',
        'G` -> r G` | apple G` | null'
      ]
    );

    const grammars10 = ['A -> A c | A a d | b d | null'];

    const rules10 = splitGrammars(grammars10);
    expect(toGrammars(clearLeftRecursion(rules10))).toEqual(
      [
        'A -> b d A` | A`',
        'A` -> c A` | a d A` | null'
      ]
    );

    const grammars11 = ['E -> E + T | T'];

    const rules11 = splitGrammars(grammars11);
    expect(toGrammars(clearLeftRecursion(rules11))).toEqual(
      [
        'E -> T E`',
        'E` -> + T E` | null'
      ]
    );

    const grammars12 = ['A -> A + | A * | A / | null'];

    const rules12 = splitGrammars(grammars12);
    expect(toGrammars(clearLeftRecursion(rules12))).toEqual(
      [
        'A -> A`',
        'A` -> + A` | * A` | / A` | null'
      ]
    );
  });

  test('not right', () => {
    const grammars = ['E -> '];

    expect(() => splitGrammars(grammars)).toThrow(Error);
  });

  test('toGrammars', () => {
    const grammars1 = [
      'E -> a A | + | a b B | a b C',
      'D -> B | C',
    ];

    const rules1 = splitGrammars(grammars1);
    expect(toGrammars(rules1)).toEqual(grammars1);

    const grammars2 = [
      'E -> a A | + | a b B | a b C',
      'D -> B | C',
    ];

    const rules2 = splitGrammars(grammars2);
    expect(toGrammars(rules2, true)).toEqual([
      'E -> a A',
      'E -> +',
      'E -> a b B',
      'E -> a b C',
      'D -> B',
      'D -> C'
    ]);

    const grammars3 = [
      'E -> null'
    ];

    const rules3 = splitGrammars(grammars3);
    expect(toGrammars(rules3)).toEqual(grammars3);
  });

  test('grammars', () => {
    const grammars1 = [
      'E -> T E1',
      'E1 -> + T E1 | null',
      'T -> F T1',
      'T1 -> * F T1 | null',
      'F -> ( E ) | id'
    ];

    const rules1 = splitGrammars(grammars1);
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

    const grammars2 = [
      'A -> B C',
      'B -> D | null',
      'C -> +',
      'D -> id'
    ];

    const rules2 = splitGrammars(grammars2);
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

    const grammars3 = [
      'A -> id',
      'A -> null'
    ];

    const rules3 = splitGrammars(grammars3);
    expect(rules3).toEqual(
      [
        {
          left: 'A',
          right: [['id'], [null]]
        }
      ]
    );

    const grammars4 = [
      'E -> T E1',
      'E1 -> + T E1',
      'E1 -> null',
      'T -> F T1',
      'T1 -> * F T1',
      'T1 -> null',
      'F -> ( E )',
      'F -> id'
    ];

    const rules4 = splitGrammars(grammars4);
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

    const grammars5 = [
      'S -> ( T ) | a + S | a',
      'T -> S T1',
      'T1 -> , S T1 | null'
    ];

    const rules5 = splitGrammars(grammars5);
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

    const grammars6 = [
      'S -> a F S1 | * a F S1',
      'S1 -> * a F S1 | null',
      'F -> + a F | + a'
    ];

    const rules6 = splitGrammars(grammars6);
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

    const grammars7 = [
      'S -> a S b',
      'S -> a S',
      'S -> null'
    ];

    const rules7 = splitGrammars(grammars7);
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
    const grammars1 = [
      'Exp -> , A | + | , b77 ; | , b77 C',
      'D -> ; | C',
    ];

    const rules1 = splitGrammars(grammars1);
    expect(toGrammars(combineLikeTerms(rules1))).toEqual([
      "Exp -> , Exp' | +",
      "Exp' -> A | b77 D",
      'D -> ; | C'
    ]);

    const grammars2 = [
      'E -> a A | a B | b A B | b C D',
      'F -> A | B',
      'G -> A B | C D'
    ];

    const rules2 = splitGrammars(grammars2);
    expect(toGrammars(combineLikeTerms(rules2))).toEqual([
      "E -> a F | b G",
      'F -> A | B',
      'G -> A B | C D'
    ]);

    const grammars3 = [
      'E -> a b A | a b B',
      'C -> A | B'
    ];

    const rules3 = splitGrammars(grammars3);
    expect(toGrammars(combineLikeTerms(rules3))).toEqual([
      "E -> a b C",
      'C -> A | B'
    ]);

    const grammars4 = [
      'E -> a b A | a b B',
    ];

    const rules4 = splitGrammars(grammars4);
    expect(toGrammars(combineLikeTerms(rules4))).toEqual([
      "E -> a b E'",
      "E' -> A | B"
    ]);

    const grammars5 = [
      'Exp -> a Ax | a By | b Ax | b By',
      'Type -> Ax | By'
    ];

    const rules5 = splitGrammars(grammars5);
    expect(toGrammars(combineLikeTerms(rules5))).toEqual([
      "Exp -> a Type | b Type",
      'Type -> Ax | By'
    ]);
  });
});
