# MoA Preset Configuration Schema

## Top-Level Keys

```yaml
moa:
  default_preset: "default"          # Which preset is active by default
  presets:                           # Named preset definitions
    <preset_name>:                   # e.g. "default", "heavy", "fast"
      reference_models: [...]        # Parallel advisor models (required)
      aggregator: {...}              # Final synthesizer (required)
      reference_max_tokens: int|null # Per-reference output cap (optional)
      reference_temperature: float   # Reference creativity (default 0.6)
      aggregator_temperature: float  # Aggregator creativity (default 0.4)
      max_tokens: int                # Aggregator output limit (default 4096)
      enabled: bool                  # Toggle preset on/off (default true)
```

## Slot Schema (reference_models and aggregator)

Each slot is a `{provider, model}` pair:

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | string | Yes | Provider identifier — built-in name or `custom:<name>` |
| `model` | string | Yes | Model tag matching the provider's catalog |

## Provider Resolution

Slots resolve through the same path as any model call:

- **Built-in**: `openrouter`, `anthropic`, `openai-codex`, `zai`, `kimi-coding`, etc.
- **Custom**: `custom:<name>` where `<name>` matches a `custom_providers` entry in `~/.hermes/config.yaml`
- Each slot independently resolves its own `base_url`, `api_key`, and `api_mode`

## Validation Rules

- At least one reference model required
- Aggregator is required — cannot be omitted
- `provider: moa` is rejected (prevents recursive MoA trees)
- Empty or missing provider/model drops the slot, falling back to defaults
- `reference_max_tokens` must be positive integer or null (unlimited)

## Example: Minimal Valid Preset

```yaml
moa:
  default_preset: quick
  presets:
    quick:
      reference_models:
        - provider: openrouter
          model: anthropic/claude-sonnet-4
      aggregator:
        provider: openrouter
          model: anthropic/claude-opus-4.8
```
