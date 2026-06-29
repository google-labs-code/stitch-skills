# Stitch Design Skills

A collection of agent skills and plugins for [Google Stitch](https://stitch.withgoogle.com), following the [Agent Skills](https://agentskills.io) open standard. Compatible with coding agents such as Codex, Antigravity, Gemini CLI, Claude Code, and Cursor.

## Quick Start

### 1. Install Plugins (Recommended)
The fastest way to set up the full Stitch plugin suite globally.

#### Codex

Add the Stitch Skills marketplace, then install the plugins you need.

<details open>
<summary><strong>Via CLI</strong> (recommended)</summary>

```bash
codex plugin marketplace add google-labs-code/stitch-skills --ref main \
  --sparse .agents/plugins \
  --sparse plugins/stitch-design \
  --sparse plugins/stitch-build \
  --sparse plugins/stitch-utilities
```

> [!TIP]
> The `--sparse` flags are optional — they limit the checkout to only the
> listed paths for a faster clone. Omit them to pull the entire repository.

</details>

<details>
<summary><strong>Via the Codex UI</strong></summary>

Navigate to **Settings → Plugin Marketplaces → Add** and fill in:

| Field | Value |
|---|---|
| **Source** | `https://github.com/google-labs-code/stitch-skills` |
| **Git ref** | `main` |
| **Sparse paths** | *(optional)* `.agents/plugins`, `plugins/stitch-design`, `plugins/stitch-build`, `plugins/stitch-utilities` |

</details>

Once the marketplace is registered, install any combination of:

- **`stitch-design`** — design-focused skills
- **`stitch-build`** — build and component skills
- **`stitch-utilities`** — utility and helper skills

#### Claude Code & Cursor

```bash
# Claude Code — installs into the current project
npx plugins add google-labs-code/stitch-skills --scope project --target claude-code
```

```bash
# Cursor — installs into the current workspace
npx plugins add google-labs-code/stitch-skills --scope workspace --target cursor
```

### 2. Install Skills Selectively
Choose only the specific skills you need.

> [!IMPORTANT]
> Stitch Design Skills often have inter-dependencies. If you choose to install skills selectively, ensure you include all required dependencies.

```bash
npx skills add google-labs-code/stitch-skills
```

You can run the following commands to see the help documentation for plugins and skills:

```bash
npx plugins --help

npx skills --help
```

## Prerequisites

These skills require the **Stitch MCP** server to be configured and running in your agent's environment. Make sure you have followed the [Stitch MCP Setup Instructions](https://stitch.withgoogle.com/docs/mcp/setup/) to register the server and set up appropriate environment variables and credentials.

## Available Plugins

### Design (`stitch-design`)

Core design workflows for creating, managing, and optimizing designs within Stitch.

| Skill | Description | Prompt Example |
|---|---|---|
| [stitch::code-to-design](plugins/stitch-design/skills/code-to-design/) | Convert frontend code (React, Vue, etc.) to a Stitch Design via HTML extraction + design system + upload | *"Upload the frontend code at `/path/to/dashboard` into a Stitch project named 'Dashboard-Migration-2026'."* |
| [stitch::generate-design](plugins/stitch-design/skills/generate-design/) | Generate new screens from text or images, edit existing screens, and create design variants | · *"Make a browse tab for a mobile app for romance and date night ideas."*<br>· *"Edit the login screen to add a 'Remember Me' checkbox and change the button color to blue."*<br>· *"Generate 3 design variants of the home screen with dark mode and high-density layouts."* |
| [stitch::manage-design-system](plugins/stitch-design/skills/manage-design-system/) | Manage design systems in Stitch — upload DESIGN.md and apply themes to screens | *"Upload our design system from `.stitch/DESIGN.md` and apply it to all screens."* |
| [stitch::extract-design-md](plugins/stitch-design/skills/extract-design-md/) | Extract a comprehensive DESIGN.md directly from frontend source code | *"Scan `/src` and extract the design system into `.stitch/DESIGN.md`."* |
| [stitch::extract-static-html](plugins/stitch-design/skills/extract-static-html/) | Extract self-contained static HTML from running web apps, inlining CSS and images | *"Extract a static HTML snapshot of `http://localhost:3000/profile`."* |
| [stitch::upload-to-stitch](plugins/stitch-design/skills/upload-to-stitch/) | Upload local assets (images, mockups, HTML) to a Stitch project | *"Upload `.stitch/landing_page.html` to Stitch project `projects/987654321`."* |

---

### Build (`stitch-build`)

Code generation, framework integration, and asset compilation from Stitch designs.

| Skill | Description | Prompt Example |
|---|---|---|
| [stitch::react-components](plugins/stitch-build/skills/react-components/) | Convert Stitch screens to React component systems with automated validation and design token consistency | · *"Convert all screens in Stitch project `projects/123` to React components."*<br>· *"Sync the app to the last updates of the Stitch project `13039335308618232534`."* |
| [stitch::react-native](plugins/stitch-build/skills/react-native/) | Convert Stitch HTML designs to production-ready React Native components with StyleSheet and platform-specific code | · *"Convert the Stitch design to React Native components with proper theme and navigation."*<br>· *"Sync the app to the last updates of the Stitch project `13039335308618232534`."* |
| [remotion](plugins/stitch-build/skills/remotion/) | Generate walkthrough videos from Stitch projects using Remotion with smooth transitions and zooming | *"Generate a walkthrough video of the Stitch project `projects/456`."* |
| [shadcn-ui](plugins/stitch-build/skills/shadcn-ui/) | Expert guidance for integrating and building applications with shadcn/ui components | *"Set up shadcn/ui and build a data table with sorting and filtering."* |

---

### Utilities (`stitch-utilities`)

Supporting tools for enhancing prompts, generating design specs, and enforcing design standards.

| Skill | Description | Prompt Example |
|---|---|---|
| [design-md](plugins/stitch-utilities/skills/design-md/) | Analyze Stitch projects and generate comprehensive DESIGN.md files in semantic language | *"Analyze Stitch project `projects/123` and generate a DESIGN.md."* |
| [enhance-prompt](plugins/stitch-utilities/skills/enhance-prompt/) | Transform vague UI ideas into polished, Stitch-optimized prompts with UI/UX keywords | *"Enhance this prompt: 'make a settings page'."* |
| [stitch-loop](plugins/stitch-utilities/skills/stitch-loop/) | Generate complete multi-page websites from a single prompt with automated validation | *"Build a 5-page portfolio website with Stitch."* |
| [taste-design](plugins/stitch-utilities/skills/taste-design/) | Generate DESIGN.md files enforcing premium, anti-generic UI standards | *"Generate a premium DESIGN.md with strict typography and calibrated colors."* |

## Repository Structure

```text
plugins/
├── stitch-design/          — Core design workflow plugin
│   ├── plugin.json
│   └── skills/
│       ├── code-to-design/
│       ├── generate-design/
│       ├── manage-design-system/
│       ├── extract-design-md/
│       ├── extract-static-html/
│       └── upload-to-stitch/
├── stitch-build/           — Code generation & build plugin
│   ├── plugin.json
│   └── skills/
│       ├── react-components/    — stitch::react-components
│       ├── react-native/
│       ├── remotion/
│       └── shadcn-ui/
└── stitch-utilities/       — Design utilities & assistants plugin
    ├── plugin.json
    └── skills/
        ├── design-md/
        ├── enhance-prompt/
        ├── stitch-loop/
        └── taste-design/
```

Each skill follows the Agent Skills standard:

```text
skills/<skill-name>/
├── SKILL.md           — The "Mission Control" for the agent
├── scripts/           — Executable enforcers (Validation & Networking)
├── resources/         — The knowledge base (Checklists & Style Guides)
└── examples/          — The "Gold Standard" syntactically valid references
```

## Adding New Skills

All new skills need to follow the file structure above to implement the Agent Skills open standard.

### Great candidates for new skills
* **Validation**: Skills that convert Stitch HTML to other UI frameworks and validate the syntax.
* **Decoupling Data**: Skills that convert static design content into external mock data files.
* **Generate Designs**: Skills that generate new design screens in Stitch from a given set of data.

This is not an officially supported Google product. This project is not eligible for the [Google Open Source Software Vulnerability Rewards Program](https://bughunters.google.com/open-source-security).
