export interface EverythingGlobInput {
  pattern: string
  path?: string
  sort?: 'path' | 'modified'
}

export interface EverythingQuery {
  args: string[]
  query: string
  sort: 'path' | 'modified'
}

export class EverythingGlobError extends Error {
  readonly code = 'EVERYTHING_UNSUPPORTED_PATTERN'

  constructor(message: string) {
    super(message)
    this.name = 'EverythingGlobError'
  }
}

export function translateEverythingGlob(input: EverythingGlobInput): EverythingQuery {
  if (input.pattern.trim().length === 0) throw new EverythingGlobError('pattern must be non-empty')
  if (input.path !== undefined && input.path.trim().length === 0) throw new EverythingGlobError('path must be non-empty')
  if (input.pattern.includes('/') || input.pattern.includes('\\') || input.pattern.includes('{') || input.pattern.includes('}')) {
    throw new EverythingGlobError(`pattern is not supported by the Everything adapter: ${input.pattern}`)
  }
  if (!/^(?:[\w .-]+|\*\.[\w-]+)$/u.test(input.pattern)) {
    throw new EverythingGlobError(`pattern is not supported by the Everything adapter: ${input.pattern}`)
  }
  const root = input.path === undefined ? undefined : input.path.replace(/[\\/]+$/u, '') + '\\'
  const args = root === undefined ? [input.pattern] : ['-path', root, input.pattern]
  if (input.sort === 'modified') args.push('-sort', 'date-modified-ascending')
  return { args, query: args.join(' '), sort: input.sort ?? 'path' }
}
