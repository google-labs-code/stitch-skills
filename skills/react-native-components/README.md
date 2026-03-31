# Stitch to React Native Components Skill

Converts Stitch designs into modular React Native components with platform-aware styling, performance best practices, and automated validation.

## Install

```bash
npx skills add google-labs-code/stitch-skills --skill react-native-components --global
```

## Example Prompt

```text
Convert my Dashboard screen in my Fitness Stitch Project to a React Native component system.
```

## Skill Structure

This repository follows the **Agent Skills** open standard. Each skill is self-contained with its own logic, validation scripts, and design tokens.

```text
skills/react-native-components/
├── SKILL.md           — Core instructions & workflow
├── README.md          — This file
├── scripts/           — Networking & validation
├── resources/         — Style guides & API references
└── examples/          — Gold-standard code samples
```

## How it Works

When activated, the agent follows a high-fidelity engineering pipeline:

1. **Retrieval**: Uses a system-level `curl` script to bypass TLS/SNI issues on Google Cloud Storage.
2. **Mapping**: Cross-references Stitch metadata with the local `style-guide.json` to ensure token consistency.
3. **Conversion**: Maps HTML/CSS primitives to React Native equivalents (`<div>` → `<View>`, `<span>` → `<Text>`, etc.).
4. **Generation**: Scaffolds components using native primitives with `StyleSheet.create()` styling.
5. **Platform Handling**: Applies `Platform.select()` for iOS/Android differences, safe area wrapping, and keyboard handling.
6. **Audit**: Performs a final self-correction check against the architecture checklist.

## Works With

- **`stitch-design` skill**: Generate and refine designs before converting to React Native components.
- **`design-md` skill**: Extract the design system for consistent theming across screens.
- **`stitch-loop` skill**: Autonomous multi-screen generation with React Native output.

## Learn More

See [SKILL.md](./SKILL.md) for complete instructions.
