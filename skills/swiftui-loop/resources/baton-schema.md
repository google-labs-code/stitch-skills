# Baton File Schema

The baton file (`next-prompt.md`) is the communication mechanism between loop iterations. It tells the next agent which SwiftUI view to build.

## Format

```yaml
---
view: <SwiftViewName>
---
<prompt-content>
```

## Fields

### Frontmatter (YAML)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `view` | string | Yes | SwiftUI view type name (PascalCase, no spaces, no `.swift` extension) |

The `view` value becomes both:
- The Stitch screen name for reference
- The output filename: `{view}.swift`

### Body (Markdown)

The body contains the full Stitch prompt, which must include:

1. **One-line description** with vibe/atmosphere keywords
2. **Design System block** (required) — copied from `DESIGN.md` Section 6
3. **Screen Structure** — numbered list of UI sections/components

## Example

```markdown
---
view: WorkoutDetailView
---
A focused workout detail screen with bold typography and energetic accents.

**DESIGN SYSTEM (REQUIRED):**
- Platform: iOS, SwiftUI
- Color Scheme: Dark adaptive
- Primary Color: Vibrant electric blue (#007AFF)
- Background: System background (near-black in dark mode)
- Font Style: SF Pro Rounded, bold headlines
- Corner Radius: 16pt (cards), 10pt (buttons)
- Spacing: 20pt standard padding, 12pt between elements
- SF Symbols style: filled
- Navigation: NavigationStack with large title

**Screen Structure:**
1. Large title "Chest Day" with workout category badge
2. Stats row: duration, sets, total volume
3. Exercise list with set/rep details and completion checkboxes
4. Floating "Start Workout" CTA button at bottom
```

## Naming Rules

- Must be valid Swift type name: PascalCase, alphanumeric only
- Must end in `View` by convention (e.g. `ProfileView`, `SettingsView`)
- Must NOT already exist in `APP.md` Section 4 (View Inventory)

## Validation Checklist

Before completing an iteration, validate your baton:

- [ ] `view` frontmatter field exists and is a valid PascalCase Swift type name
- [ ] `view` name ends in `View`
- [ ] Prompt includes the design system block from `DESIGN.md`
- [ ] Prompt describes a view NOT already in `APP.md` view inventory
- [ ] Prompt includes specific screen structure details
- [ ] `deviceType` is `MOBILE` (or explicitly overridden for iPad: `TABLET`)
