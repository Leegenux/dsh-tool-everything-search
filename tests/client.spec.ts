import { describe, expect, it } from 'vitest'
import { normalizeEverythingResults, type EverythingClient } from '../src/everything-client.ts'

describe('Everything client result normalization', () => {
  it('normalizes CRLF output, removes blanks, and preserves result order', () => {
    expect(normalizeEverythingResults('C:\\a.log\r\n\r\nC:\\b.log\r\n')).toEqual(['C:\\a.log', 'C:\\b.log'])
  })

  it('executes a translated query through an injected client', async () => {
    const calls: string[] = []
    const client: EverythingClient = { search: async query => { calls.push(query); return ['C:\\a.log'] } }
    await expect(client.search('*.log')).resolves.toEqual(['C:\\a.log'])
    expect(calls).toEqual(['*.log'])
  })
})
