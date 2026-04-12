# Stitch MCP Setup Guide

Use this guide when the skill needs Stitch access but the agent cannot see Stitch tools yet.

## Choose the integration path

There are two practical paths:

### 1. Agent-facing MCP path

Use this when Claude Code, Cursor, Gemini CLI, Codex, OpenCode, or another coding agent should call Stitch tools directly.

A practical local proxy is `@_davideast/stitch-mcp`, which can expose Stitch through a local stdio MCP server.

Fast path:

```bash
npx @_davideast/stitch-mcp init
```

That flow can set up auth, gcloud, and MCP client configuration.

Typical MCP server entry:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"]
    }
  }
}
```

If you already use a system `gcloud` profile and want to reuse it:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_USE_SYSTEM_GCLOUD": "1"
      }
    }
  }
}
```

### 2. SDK path

Use this when you are writing your own scripts, services, or orchestration code instead of connecting a coding agent through a local MCP config.

Install the official SDK:

```bash
npm install @google/stitch-sdk
```

Minimal example:

```ts
import { stitch } from "@google/stitch-sdk";

const project = stitch.project("your-project-id");
const screen = await project.generate("A dashboard with charts", "DESKTOP");
const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();
```

## Authentication options

### API key path

If you have a Stitch API key, set:

```bash
export STITCH_API_KEY="your-api-key"
```

This is the simplest path for direct SDK use and can also simplify local proxy use.

### OAuth plus Google Cloud project path

Some setups use OAuth plus a Google Cloud project context instead of an API key.

Common environment variables you may see:
- `STITCH_ACCESS_TOKEN`
- `GOOGLE_CLOUD_PROJECT`
- `STITCH_PROJECT_ID`
- `STITCH_HOST`

For local proxy flows that lean on `gcloud`, follow the proxy tool's auth steps or the official Stitch docs.

## Verification checklist

After setup, verify the connection before trying to use any Stitch skill.

### If you use the local proxy

```bash
npx @_davideast/stitch-mcp doctor
npx @_davideast/stitch-mcp tool
```

You want to see a healthy doctor result and a tool list that includes core Stitch operations such as:
- `create_project`
- `generate_screen_from_text`
- `get_project`
- `get_screen`
- `edit_screens`

### If you use a coding agent client

Run the agent's tool discovery step and confirm the Stitch namespace is visible. The skills in this repo usually assume a namespace like:
- `stitch:`
- `mcp_stitch:`

### If you use the SDK directly

Write a quick smoke test that lists projects or retrieves screens for a known project.

## Troubleshooting

If setup fails, check these first:
- billing is enabled on the Google Cloud project
- the Stitch API is enabled
- the authenticated user has Owner or Editor access
- the OAuth flow actually completed
- the agent process received the needed env vars

Environment caveat:
- WSL, SSH sessions, Docker containers, and Cloud Shell may not open a browser automatically for auth. In those cases, copy the printed OAuth URL into a browser manually.

## Recommended references

Keep these links handy and verify details against the latest docs:
- `https://stitch.withgoogle.com/docs/mcp/setup`
- `https://stitch.withgoogle.com/docs/mcp/guide/`
- `https://stitch.withgoogle.com/docs/sdk/agent-workflows/`

## Notes

- The official SDK package is `@google/stitch-sdk`
- A local proxy such as `@_davideast/stitch-mcp` is useful when an agent expects a local MCP server process
- Always confirm the actual visible tool names in your environment before hardcoding prefixes in prompts or scripts
