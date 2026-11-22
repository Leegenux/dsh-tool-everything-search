# DSH Everything Glob

A read-only DSH tool plugin that queries the Windows Everything index through the official `es.exe` command-line client.

## Scope

The plugin registers `everything_glob` alongside DSH's built-in `glob` tool. It does not replace the built-in tool and it does not maintain a DSH-owned file index.

Supported patterns currently include exact basenames and simple suffix patterns such as `*.log`, optionally restricted with a Windows `path`. Recursive `**` patterns and brace expansion are rejected until their semantics are verified against Everything.

## Configuration

```yaml
- id: everything-glob
  name: '@deepseek-ai/dsh-tool-everything-search'
  config:
    executable: 'C:/Program Files/Everything/es.exe'
    maxResults: 100
```

Use an absolute path for `es.exe`. The plugin is read-only and does not change Everything settings.

## Requirements

- Windows
- Everything running with an indexed volume
- official Everything `es.exe`
- a DSH host that provides `ctx.tools`

## Verification

The isolated DSH acceptance run loaded the plugin in a real headless host, called `everything_glob`, queried the installed `es.exe`, and returned indexed `.log` paths to the Agent. Web UI interaction was not included in that acceptance run.
