# Example MoA Presets

Copy-paste ready configurations for common setups.

## Pentagon Providers (Self-Hosted)

Two different model families on custom endpoints — maximum diversity:

```yaml
moa:
  default_preset: pentagon
  presets:
    pentagon:
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

## OpenRouter Mix (Cloud)

Three references spanning different architectures, strong aggregator:

```yaml
moa:
  default_preset: cloud
  presets:
    cloud:
      reference_models:
        - provider: openrouter
          model: anthropic/claude-sonnet-4
        - provider: openrouter
          model: deepseek/deepseek-v4-pro
        - provider: openrouter
          model: qwen/qwen3-235b-a22b-thinking-2507
      aggregator:
        provider: openrouter
        model: anthropic/claude-opus-4.8
      reference_max_tokens: 600
      max_tokens: 4096
      enabled: true
```

## Fast and Cheap (Budget)

Lightweight references, fast aggregator — good for quick questions:

```yaml
moa:
  default_preset: budget
  presets:
    budget:
      reference_models:
        - provider: openrouter
          model: google/gemini-2.5-flash-lite-preview-06-17
        - provider: openrouter
          model: qwen/qwen3-30b-a3b-thinking-2507
      aggregator:
        provider: openrouter
        model: anthropic/claude-sonnet-4
      reference_max_tokens: 400
      max_tokens: 2048
      enabled: true
```

## Heavy Analysis (Maximum Quality)

Strong references, strong aggregator — for complex reasoning tasks:

```yaml
moa:
  default_preset: heavy
  presets:
    heavy:
      reference_models:
        - provider: openrouter
          model: anthropic/claude-opus-4.8
        - provider: openrouter
          model: deepseek/deepseek-v4-pro
        - provider: openai-codex
          model: gpt-5.5
      aggregator:
        provider: openrouter
        model: anthropic/claude-opus-4.8
      reference_max_tokens: 1500
      max_tokens: 8192
      enabled: true
```

## Applying a Preset

```bash
# Check what's configured
hermes moa list

# Use one-shot
/moa <your prompt>

# Switch session-wide
/model pentagon --provider moa
/model cloud --provider moa
/model heavy --provider moa
```
