# App Template

Use these templates when setting up a new project for the SwiftUI build loop.

## APP.md Template

```markdown
# App Vision & Constitution

> **AGENT INSTRUCTION:** Read this file before every iteration. It serves as the project's "Long-Term Memory."

## 1. Core Identity
* **App Name:** [Your app name]
* **Bundle ID:** [com.yourcompany.appname]
* **Stitch Project ID:** [Your Stitch project ID]
* **Mission:** [What the app does]
* **Target Audience:** [Who uses this app]
* **Voice:** [Tone and personality descriptors]
* **Platform:** iOS [version]+ / iPadOS [version]+

## 2. Visual Language
*Reference these descriptors when prompting Stitch.*

* **The "Vibe" (Adjectives):**
    * *Primary:* [Main aesthetic keyword]
    * *Secondary:* [Supporting aesthetic]
    * *Tertiary:* [Additional flavor]

## 3. Architecture & Navigation
* **Root Navigation:** TabView with [N] tabs / NavigationStack
* **Tab Structure:**
    * Tab 1: [Name] → [RootView name]
    * Tab 2: [Name] → [RootView name]
* **Sources Directory:** `Sources/Views/`
* **Asset Flow:** Stitch generates to `queue/` → Validate → Move to `Sources/Views/`

## 4. View Inventory (Current State)
*Update this when a new view is successfully integrated.*

* [x] `ContentView` - Root tab/navigation container
* [ ] `HomeView` - [Description]

## 5. The Roadmap (Backlog)
*Pick the next task from here if available.*

### High Priority
- [ ] [View name + description]
- [ ] [View name + description]

### Medium Priority
- [ ] [View name + description]

## 6. Creative Freedom Guidelines
*When the backlog is empty, follow these guidelines to innovate.*

1. **Stay On-Brand:** New views must fit the established vibe
2. **Enhance the Core:** Support the app's primary user journey
3. **Naming Convention:** PascalCase, always suffixed with `View`

### Ideas to Explore
*Pick one, build it, then REMOVE it from this list.*

- [ ] `StatsView` - [Description]
- [ ] `SettingsView` - [Description]

## 7. Rules of Engagement
1. Do not recreate views in Section 4
2. Always update `next-prompt.md` before completing
3. Consume ideas from Section 6 when you use them
4. Keep the loop moving
```

---

## DESIGN.md Template (SwiftUI Extended)

Generate the base using the `design-md` skill from an existing Stitch screen, then **add Section 6** with SwiftUI-specific tokens:

```markdown
# Design System: [App Name]
**Project ID:** [Stitch Project ID]

## 1. Visual Theme & Atmosphere
[Describe mood, density, aesthetic philosophy]

## 2. Color Palette & Roles
- **[Descriptive Name]** (#hexcode) – [Functional role]
- **[Descriptive Name]** (#hexcode) – [Functional role]

## 3. Typography Rules
[Font family, weights, sizes, spacing]

## 4. Component Stylings
* **Buttons:** [Shape, color, behavior]
* **Cards:** [Corners, background, shadows]
* **Inputs:** [Stroke, background, focus states]

## 5. Layout Principles
[Whitespace strategy, margins, grid alignment]

## 6. Design System Notes for Stitch Generation
**Copy this block into every baton prompt:**

**DESIGN SYSTEM (REQUIRED):**
- Platform: iOS, SwiftUI
- Color Scheme: [Dark / Light / Adaptive]
- Primary Color: [Description] (#hex)
- Background: [Description] (#hex or system name)
- Secondary Background: [Description] (#hex or system name)
- Accent: [Description] (#hex)
- Font Style: [SF Pro / SF Pro Rounded / custom]
- Corner Radius: [Npt (cards), Npt (buttons)]
- Spacing: [Npt standard padding, Npt between elements]
- SF Symbols style: [filled / outlined / monochrome]
- Navigation: [TabView with N tabs / NavigationStack / NavigationSplitView]
```
