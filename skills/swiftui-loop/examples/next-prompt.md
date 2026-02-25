---
view: WorkoutsView
---
A browsable list of workout templates for a fitness tracking app, grouped by muscle group with bold category headers and card-style rows.

**DESIGN SYSTEM (REQUIRED):**
- Platform: iOS, SwiftUI
- Color Scheme: Dark adaptive
- Primary Color: Vibrant electric blue (#007AFF)
- Background: System background (near-black #1C1C1E in dark mode)
- Secondary Background: Elevated surface (#2C2C2E in dark mode)
- Accent: Electric blue (#007AFF) for highlights and CTAs
- Font Style: SF Pro Rounded, bold headlines
- Corner Radius: 16pt (cards), 10pt (buttons)
- Spacing: 20pt standard padding, 12pt between elements
- SF Symbols style: filled
- Navigation: NavigationStack with large title

**Screen Structure:**
1. Navigation bar with large title "Workouts" and a filter button (line.3.horizontal.decrease.circle)
2. Horizontal scroll of category chips: All, Chest, Back, Legs, Arms, Core
3. Section header "Chest" with workout count
4. Card rows: workout name, exercise count, estimated duration, difficulty badge
5. Repeat sections for each muscle group
6. Floating "Create Workout" button at bottom right (plus.circle.fill)
