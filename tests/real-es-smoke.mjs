import { createEsCommandRunner, EsEverythingClient } from '../src/everything-client.ts'
const client = new EsEverythingClient(createEsCommandRunner('C:/Users/qq135/DSH/tools/everything-es/es.exe'))
const results = await client.search(['-path', 'C:/Users/qq135/DSH/state/runs/artifacts/', '*.log'])
console.log(JSON.stringify({ count: results.length, first: results.slice(0, 3) }))
