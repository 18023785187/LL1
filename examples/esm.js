import { makeLL1 } from '../dist/ll1.esm.js'

const grammars = [
  'E -> T $ E1',
  'E1 -> + $ T E1 | null',
  'T -> $ F T1',
  'T1 -> * F $ T1 | null',
  'F -> ( E $ ) | id'
]
const terminalSymbols = ['+', '*', '(', 'id', ')']

const ll1 = makeLL1(grammars, terminalSymbols)

ll1.print()
