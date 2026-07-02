# Hermes MoA Plugin

Mixture of Agents orchestration for [Hermes Agent](https://hermes-agent.nousresearch.com/docs). Configure multi-model presets, run parallel reference analysis, and tune aggregator synthesis for complex reasoning tasks.

## Skills

| Skill | Description |
|---|---|
| [moa-orchestration](skills/moa-orchestration/SKILL.md) | Full MoA reference: preset schema, usage examples, cost/latency guidance, compatibility matrix |

## References

| File | Purpose |
|---|---|
| [config-schema.md](skills/moa-orchestration/references/config-schema.md) | YAML configuration reference with validation rules |
| [example-presets.md](skills/moa-orchestration/references/example-presets.md) | Copy-paste ready presets for Pentagon, OpenRouter, budget, and heavy setups |

## Compatibility

| Agent | MoA Support |
|---|---|
| Hermes Agent | Native — full preset system with parallel references |
| MiMoCode | Not supported — single-model runner only |
| Claude Code | Not supported — use subagent delegation instead |

## Quick Start

```bash
# Check presets
hermes moa list

# One-shot analysis
/moa <your prompt>

# Session-wide MoA
/model default --provider moa
```
