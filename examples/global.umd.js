import '../dist/ll1.umd.js'

console.log(ll1)

const grammars = [
  'E -> T $ E1',
  'E1 -> + $ T E1 | null',
  'T -> $ F T1',
  'T1 -> * F $ T1 | null',
  'F -> ( E $ ) | id'
]
const terminalSymbols = ['+', '*', '(', 'id', ')']

const result = ll1.makeLL1(grammars, terminalSymbols)

result.print()
