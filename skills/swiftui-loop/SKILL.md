---
name: swiftui-loop
description: Teaches agents to iteratively build iOS SwiftUI views using Stitch mockups with an autonomous baton-passing loop pattern
allowed-tools:
  - "stitch*:*"
  - "Read"
  - "Write"
  - "Bash"
---

# SwiftUI Build Loop

You are an **autonomous iOS frontend builder** participating in an iterative view-building loop. Your goal is to generate a mobile screen mockup using Stitch, translate it into a SwiftUI `View`, integrate it into the app, and prepare instructions for the next iteration.

## Overview

The Build Loop pattern enables continuous, autonomous iOS app development through a "baton" system. Each iteration:
1. Reads the current task from a baton file (`next-prompt.md`)
2. Generates a mobile screen mockup using Stitch MCP tools
3. Translates the mockup into a SwiftUI `View` (`.swift` file)
4. Integrates the view into the app structure
5. Writes the next task to the baton file for the next iteration

## Prerequisites

**Required:**
- Access to the Stitch MCP Server
- A Stitch project (existing or will be created)
- A `DESIGN.md` file (generate one using the `design-md` skill if needed)
- An `APP.md` file documenting the app vision and view inventory

## The Baton System

The `next-prompt.md` file acts as a relay baton between iterations:

```markdown
---
view: ProfileView
---
A user profile screen for a fitness tracking app.

**DESIGN SYSTEM (REQUIRED):**
[Copy from DESIGN.md Section 6]

**Screen Structure:**
1. Avatar and display name at top
2. Stats row: workouts, streak, calories
3. Recent activity list
4. Settings button in navigation bar
```

**Critical rules:**
- The `view` field in YAML frontmatter determines the Swift filename (e.g. `ProfileView` → `ProfileView.swift`)
- The view name must be a valid Swift type name (PascalCase, no spaces)
- The prompt content must include the design system block from `DESIGN.md`
- You MUST update this file before completing your work to continue the loop

## Execution Protocol

### Step 1: Read the Baton

Parse `next-prompt.md` to extract:
- **View name** from the `view` frontmatter field (e.g. `ProfileView`)
- **Prompt content** from the markdown body

### Step 2: Consult Context Files

Before generating, read these files:

| File | Purpose |
|------|---------|
| `APP.md` | App vision, **Stitch Project ID**, existing views inventory, navigation structure, roadmap |
| `DESIGN.md` | Required visual style for Stitch prompts and SwiftUI design tokens |

**Important checks:**
- Section 4 (View Inventory) — Do NOT recreate views that already exist
- Section 5 (Roadmap) — Pick tasks from here if backlog exists
- Section 6 (Creative Freedom) — Ideas for new views if roadmap is empty

### Step 3: Generate Mockup with Stitch

Use the Stitch MCP tools to generate a mobile screen mockup:

1. **Discover namespace**: Run `list_tools` to find the Stitch MCP prefix
2. **Get or create project**:
   - If `stitch.json` exists, use the `projectId` from it
   - Otherwise, call `[prefix]:create_project` and save the ID to `stitch.json`
3. **Generate screen**: Call `[prefix]:generate_screen_from_text` with:
   - `projectId`: The project ID
   - `prompt`: The full prompt from the baton (including design system block)
   - `deviceType`: `MOBILE` (default) or as specified in the baton
4. **Retrieve assets**: Call `[prefix]:get_screen` to get:
   - `screenshot.downloadUrl` — Download and save as `queue/{ViewName}.png` (visual reference)
   - `htmlCode.downloadUrl` — Download and save as `queue/{ViewName}.html` (layout/spacing reference)

### Step 4: Translate to SwiftUI

Using the Stitch screenshot and HTML as your visual reference, write a complete SwiftUI view to `queue/{ViewName}.swift`:

1. **Reproduce the layout faithfully**: Match the visual hierarchy, spacing, and component arrangement from the mockup
2. **Apply SwiftUI design tokens** from `DESIGN.md` Section 6:
   - Colors: `Color("AccentColor")`, `Color(hex:)`, or `.primary`/`.secondary`
   - Fonts: `.font(.headline)`, `.font(.custom(...))`, `.fontWeight()`
   - Corner radius, padding, and spacing values
   - SF Symbols names for icons
3. **Use idiomatic SwiftUI**:
   - `VStack`, `HStack`, `ZStack`, `LazyVStack`, `LazyHGrid` for layout
   - `List` or `ScrollView` for scrollable content
   - `NavigationLink` for drill-down navigation
   - `@State`, `@Binding`, `@ObservedObject` for state as appropriate
   - `.toolbar` and `ToolbarItem` for navigation bar buttons
   - `AsyncImage` for remote images
4. **Include a `#Preview`** macro at the bottom for Xcode Previews
5. **Keep the view self-contained** with sensible placeholder/mock data

Example output structure:
```swift
import SwiftUI

struct ProfileView: View {
    var body: some View {
        // ...
    }
}

#Preview {
    ProfileView()
}
```

### Step 5: Integrate into App

1. Move generated Swift file from `queue/{ViewName}.swift` to `Sources/Views/{ViewName}.swift`
2. Wire navigation:
   - Add a `NavigationLink` to the new view from its logical parent
   - If it belongs in the root `TabView`, add a new tab entry in `ContentView.swift`
   - Replace any placeholder `NavigationLink(destination: EmptyView())` stubs
3. Ensure the view is reachable from the existing navigation graph

### Step 6: Update App Documentation

Modify `APP.md`:
- Add the new view to Section 4 (View Inventory) with `[x]`
- Remove any idea you consumed from Section 6 (Creative Freedom)
- Update Section 5 (Roadmap) if you completed a backlog item

### Step 7: Prepare the Next Baton (Critical)

**You MUST update `next-prompt.md` before completing.** This keeps the loop alive.

1. **Decide the next view**:
   - Check `APP.md` Section 5 (Roadmap) for pending items
   - If empty, pick from Section 6 (Creative Freedom)
   - Or invent something new that fits the app vision
2. **Write the baton** with proper YAML frontmatter:

```markdown
---
view: SettingsView
---
A settings screen with grouped options for account, notifications, and privacy.

**DESIGN SYSTEM (REQUIRED):**
[Copy the entire design system block from DESIGN.md]

**Screen Structure:**
1. Navigation bar with "Settings" title
2. Grouped list: Account section (profile, password)
3. Grouped list: Notifications section (push, email toggles)
4. Grouped list: About section (version, privacy policy link)
```

## File Structure Reference

```
project/
├── next-prompt.md          # The baton — current task
├── stitch.json             # Stitch project ID (persist this!)
├── DESIGN.md               # Visual design system (from design-md skill)
├── APP.md                  # App vision, view inventory, roadmap
├── queue/                  # Staging area for generated output
│   ├── {ViewName}.png      # Stitch screenshot (visual reference)
│   ├── {ViewName}.html     # Stitch HTML (layout reference)
│   └── {ViewName}.swift    # Generated SwiftUI view (before integration)
└── Sources/Views/          # Integrated SwiftUI views
    ├── ContentView.swift
    └── {ViewName}.swift
```

## Orchestration Options

The loop can be driven by different orchestration layers:

| Method | How it works |
|--------|--------------|
| **CI/CD** | GitHub Actions triggers on `next-prompt.md` changes |
| **Human-in-loop** | Developer reviews each iteration before continuing |
| **Agent chains** | One agent dispatches to another (e.g., Jules API) |
| **Manual** | Developer runs the agent repeatedly with the same repo |

The skill is orchestration-agnostic — focus on the pattern, not the trigger mechanism.

## Design System Integration

This skill works best with the `design-md` skill:

1. **First time setup**: Generate `DESIGN.md` using the `design-md` skill from an existing Stitch screen, then extend Section 6 with SwiftUI-specific tokens (see `resources/app-template.md`)
2. **Every iteration**: Copy Section 6 ("Design System Notes for Stitch Generation") into your baton prompt
3. **Consistency**: All generated views will share the same visual language

## Common Pitfalls

- ❌ Forgetting to update `next-prompt.md` (breaks the loop)
- ❌ Recreating a view that already exists in the view inventory
- ❌ Not including the design system block in the Stitch prompt
- ❌ Using `deviceType: DESKTOP` — always use `MOBILE` for iOS views
- ❌ Leaving placeholder `NavigationLink(destination: EmptyView())` instead of wiring real navigation
- ❌ Forgetting to persist `stitch.json` after creating a new project
- ❌ Writing UIKit code instead of SwiftUI
- ❌ Missing `#Preview` macro (breaks Xcode Previews)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Stitch generation fails | Check that the prompt includes the design system block |
| Inconsistent styles | Ensure `DESIGN.md` is up-to-date and copied correctly |
| Loop stalls | Verify `next-prompt.md` was updated with valid frontmatter |
| SwiftUI compile error | Check that all referenced types and assets exist in the project |
| Navigation broken | Verify the view is reachable from `ContentView` or the relevant parent |
| View looks nothing like mockup | Re-examine the Stitch screenshot in `queue/` and adjust layout/colors |
