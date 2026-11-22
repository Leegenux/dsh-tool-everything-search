import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'
import { EsEverythingClient, createEsCommandRunner } from './everything-client.ts'
import { translateEverythingGlob } from './query.ts'

export const name = 'tool-everything-search'
export const inject = ['tools']

export interface Config {
  executable: string
  maxResults?: number
}

export const Config: z<Config> = z.object({
  executable: z.string().required(),
  maxResults: z.number().default(100),
})

export async function apply(ctx: Context, config: Config): Promise<void> {
  const client = new EsEverythingClient(createEsCommandRunner(config.executable))
  const tool = defineTool({
    name: 'everything_glob',
    description: 'Search Windows indexed files through Everything using the supported glob subset.',
    parameters: {
      pattern: { type: 'string', required: true },
      path: { type: 'string' },
      sort: { type: 'string' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          paths: { type: 'array', required: true, items: { type: 'string' } },
          query: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: value.paths.join('\n') }],
    },
    async execute(args) {
      const query = translateEverythingGlob(args as { pattern: string; path?: string; sort?: 'path' | 'modified' })
      const paths = (await client.search(query.args)).slice(0, config.maxResults ?? 100)
      return { paths, query: query.query }
    },
  })
  ctx.tools.register(tool)
}

export { EsEverythingClient, createEsCommandRunner, translateEverythingGlob }
export type { EverythingClient, EverythingCommandRunner } from './everything-client.ts'
export type { EverythingGlobError, EverythingGlobInput, EverythingQuery } from './query.ts'
