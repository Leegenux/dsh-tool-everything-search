import * as everythingSearch from '../src/index.ts'
import { describe, expect, it } from 'vitest'

describe('dsh-tool-everything-search load contract', () => {
  it('exports the namespace plugin shape without a default export', () => {
    expect('default' in everythingSearch).toBe(false)
    expect(everythingSearch.name).toBe('tool-everything-search')
    expect(everythingSearch.inject).toEqual(['tools'])
    expect(typeof everythingSearch.Config).toBe('function')
    expect(typeof everythingSearch.apply).toBe('function')
  })
})
