export interface EverythingClient {
  search(query: string | readonly string[]): Promise<string[]>
}

export function normalizeEverythingResults(stdout: string): string[] {
  return stdout.split(/\r?\n/u).map(line => line.trim()).filter(line => line.length > 0)
}

export interface EverythingCommandRunner {
  run(args: readonly string[]): Promise<string>
}

/** Create a read-only runner for an absolute official `es.exe` path. */
export function createEsCommandRunner(executable: string): EverythingCommandRunner {
  return {
    run: async args => {
      const { spawn } = await import('node:child_process')
      return await new Promise<string>((resolve, reject) => {
        const child = spawn(executable, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
        const stdout: Buffer[] = []
        const stderr: Buffer[] = []
        child.stdout.on('data', chunk => stdout.push(Buffer.from(chunk)))
        child.stderr.on('data', chunk => stderr.push(Buffer.from(chunk)))
        child.once('error', reject)
        child.once('close', code => {
          if (code !== 0) {
            reject(new Error(`Everything CLI exited with code ${code}: ${Buffer.concat(stderr).toString('utf8').trim()}`))
            return
          }
          resolve(Buffer.concat(stdout).toString('utf8'))
        })
      })
    },
  }
}

/** Read-only adapter around the official ES command-line client. */
export class EsEverythingClient implements EverythingClient {
  constructor(private readonly runner: EverythingCommandRunner) {}

  async search(query: string | readonly string[]): Promise<string[]> {
    return normalizeEverythingResults(await this.runner.run(typeof query === 'string' ? [query] : query))
  }
}
