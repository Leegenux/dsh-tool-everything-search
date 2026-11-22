import { describe, expect, it } from 'vitest'
import { translateEverythingGlob, EverythingGlobError } from '../src/query.ts'

describe('translateEverythingGlob', () => {
  it('translates a suffix pattern under an explicit Windows root', () => {
    expect(translateEverythingGlob({ pattern: '*.log', path: 'C:\\Users\\qq135\\DSH\\state' })).toEqual({
      args: ['-path', 'C:\\Users\\qq135\\DSH\\state\\', '*.log'],
      query: '-path C:\\Users\\qq135\\DSH\\state\\ *.log',
      sort: 'path',
    })
  })

  it('translates an exact basename without making a recursive glob promise', () => {
    expect(translateEverythingGlob({ pattern: 'telegram_context_original_0', path: 'C:\\Users\\qq135\\DSH\\state' })).toEqual({
      args: ['-path', 'C:\\Users\\qq135\\DSH\\state\\', 'telegram_context_original_0'],
      query: '-path C:\\Users\\qq135\\DSH\\state\\ telegram_context_original_0',
      sort: 'path',
    })
  })

  it('allows modified sorting as an explicit output choice', () => {
    expect(translateEverythingGlob({ pattern: '*.log', path: 'C:\\', sort: 'modified' })).toMatchObject({ sort: 'modified' })
  })

  it('rejects recursive and compound patterns until their semantics are verified', () => {
    expect(() => translateEverythingGlob({ pattern: '**/*.log', path: 'C:\\' })).toThrow(EverythingGlobError)
    expect(() => translateEverythingGlob({ pattern: '*.{log,txt}', path: 'C:\\' })).toThrow(EverythingGlobError)
  })
})
