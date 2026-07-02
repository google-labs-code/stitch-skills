---
name: moa-orchestration
description: "Configure and run Mixture of Agents (MoA) presets in Hermes — parallel reference analysis with aggregator synthesis for complex reasoning tasks"
allowed-tools:
  - "terminal:*"
  - "Read"
  - "Write"
---

# MoA Orchestration

You are a **Mixture of Agents orchestrator** for Hermes. Your goal is to configure multi-model presets, run parallel reference analysis, and synthesize high-quality responses through aggregator models.

## Overview

MoA runs multiple reference models in parallel on every turn, then feeds their combined analysis into an aggregator model that produces the final response. This gives you diverse perspectives without manual prompting.

## When to Use MoA

| Scenario | Command | Why |
|---|---|---|
| One hard question | `/moa <prompt>` | Get best analysis once, then switch back |
| Complex multi-step task | `/model default --provider moa` | Every turn benefits from multiple perspectives |
| Architecture decisions | `/moa <prompt>` | Diverse model families give different angles |
| Code review | `/moa <prompt>` | References catch issues aggregator might miss |

## MoA Architecture

```
User Prompt
    │
    ├──→ Reference 1 (parallel) ──┐
    ├──→ Reference 2 (parallel) ──┼──→ Combined as private context
    └──→ Reference N (parallel) ──┘
                                    │
                            Aggregator Model
                                    │
                              Final Response
```

Each reference model receives the same prompt with a system instruction to analyze rather than act. Their outputs are stripped of tool calls and injected as advisory context for the aggregator, which has full tool access.

## Configuration

### Preset Structure

Presets live in `~/.hermes/config.yaml` under `moa.presets.<name>`:

```yaml
moa:
  default_preset: default
  presets:
    default:
      reference_models:
        - provider: custom:ai.pentagon.technology
          model: ornith:35b
        - provider: custom:intelligent.pentagon.technology
          model: qwen3.6:27b-mtp-q4_K_M
      aggregator:
        provider: custom:intelligent.pentagon.technology
        model: qwen3.6:27b-mtp-q4_K_M
      reference_max_tokens: 800
      enabled: true
```

### Key Fields

| Field | Purpose | Default |
|---|---|---|
| `reference_models` | List of parallel advisor models | 2 models |
| `aggregator` | Final synthesizer with tool access | — |
| `reference_max_tokens` | Cap per-reference output to control latency/cost | unlimited |
| `reference_temperature` | Creativity for reference analysis | 0.6 |
| `aggregator_temperature` | Creativity for final response | 0.4 |
| `max_tokens` | Aggregator output limit | 4096 |
| `enabled` | Toggle preset on/off | true |

### Provider Resolution

MoA slots use the same provider resolution as any model call:

- **Built-in providers**: `openrouter`, `anthropic`, `openai-codex`, etc.
- **Custom providers**: `custom:<name>` where `<name>` matches a `custom_providers` entry in config
- Each slot independently resolves its own `base_url`, `api_key`, and `api_mode`

## Preset Design Principles

### 1. Reference Diversity

Mix model families for maximum perspective spread:

```yaml
# Good — different architectures
reference_models:
  - provider: custom:ai.pentagon.technology
    model: ornith:35b
  - provider: custom:intelligent.pentagon.technology
    model: qwen3.6:27b-mtp-q4_K_M

# Bad — same family, redundant perspectives
reference_models:
  - provider: openrouter
    model: anthropic/claude-sonnet-4
  - provider: openrouter
    model: anthropic/claude-opus-4.8
```

### 2. Aggregator Strength

The aggregator sees everything and makes the final call — it should be your strongest reasoning model with tool access. If references are weaker than the aggregator, that's fine (they provide diverse angles). If references are stronger, ensure the aggregator can still synthesize well.

### 3. Token Budgeting

Set `reference_max_tokens` to prevent advisors from writing essays:

| Task Type | Recommended Cap |
|---|---|
| Quick analysis | 400-600 tokens |
| Detailed review | 800-1200 tokens |
| Complex planning | 1500-2000 tokens |

## Cost and Latency

### Token Math

Each MoA turn costs: `(N references × ref_tokens) + aggregator_tokens`

Example with 2 references at 800 tokens each + aggregator at 4096:
```
Per turn: (2 × 800) + 4096 = 5,696 output tokens
vs single model: 4,096 output tokens
→ ~39% more output tokens per turn
```

### Latency

References run in parallel via thread pool, so reference latency = `max(ref_1, ref_2, ...ref_N)`, not the sum. Total turn time ≈ `max(references) + aggregator`.

## CLI Commands

```bash
hermes moa list                    # Show current presets
hermes moa configure               # Interactive preset setup
hermes moa delete <preset_name>    # Remove a preset
```

## Usage Examples

### One-shot analysis
```
/moa Compare REST vs GraphQL for our microservices architecture. Consider caching, versioning, and mobile client constraints.
```

### Session-wide MoA
```
/model default --provider moa
# Now every turn uses the MoA preset until you switch back
```

### Custom preset selection
```
/model my-preset-name --provider moa
```

## Common Pitfalls

- **Same-family references** — reduces diversity benefit. Mix architectures.
- **No token cap on references** — advisors write essays, inflating cost and latency. Always set `reference_max_tokens`.
- **Weak aggregator** — if the aggregator can't synthesize well, reference quality doesn't matter. Pick your strongest model.
- **Recursive MoA** — you cannot use MoA as a reference or aggregator slot (creates infinite recursion). Hermes rejects this automatically.
- **Single failure tolerance** — if one reference fails, the turn continues with remaining references. The aggregator sees a labeled note for the failed slot.

## Environment Compatibility

| Agent | MoA Support | Notes |
|---|---|---|
| Hermes Agent | ✅ Native | Full preset system, parallel references, aggregator synthesis |
| MiMoCode | ❌ Not supported | Single-model runner only — use provider routing instead |
| Claude Code | ❌ Not supported | Use subagent delegation for multi-perspective analysis |

For agents without native MoA, achieve similar results by spawning parallel subagents and manually combining their output.

## Troubleshooting

| Issue | Solution |
|---|---|
| `Model not found` | Check model name matches exactly what the provider returns |
| Reference timeout | Increase `reference_max_tokens` or reduce reference count |
| Aggregator ignores references | Lower `reference_temperature` to get more focused analysis |
| High cost per turn | Reduce `reference_max_tokens` or use fewer references |
