---
stitch-project-id: 13534454087919359824
---
# App Vision & Constitution

> **AGENT INSTRUCTION:** Read this file before every iteration. It serves as the project's "Long-Term Memory." If `next-prompt.md` is empty, pick the highest priority item from Section 5 OR invent a new view that fits the app vision.

## 1. Core Identity
* **App Name:** FitTrack
* **Bundle ID:** `com.example.fittrack`
* **Stitch Project ID:** `13534454087919359824`
* **Mission:** A personal fitness tracking app that helps users log workouts, visualize progress, and stay motivated.
* **Target Audience:** Fitness enthusiasts, gym-goers, and anyone building an active lifestyle.
* **Voice:** Energetic, motivating, clean, and data-forward.
* **Platform:** iOS 17+

## 2. Visual Language (Stitch Prompt Strategy)
*Strictly adhere to these descriptive rules when prompting Stitch. Do NOT use code.*

* **The "Vibe" (Adjectives):**
    * *Primary:* **Energetic** (Bold typography, strong contrast, action-oriented).
    * *Secondary:* **Clean** (Generous whitespace, minimal chrome, content-first).
    * *Tertiary:* **Data-forward** (Numbers and stats are heroes, clear hierarchy).

* **Color Philosophy (Semantic):**
    * **Backgrounds:** System background (near-black #1C1C1E in dark mode).
    * **Accents:** Vibrant electric blue (#007AFF) for CTAs and highlights.
    * **Text:** Primary white (#FFFFFF) for headlines, secondary gray (#8E8E93) for supporting text.

## 3. Architecture & Navigation
* **Root Navigation:** TabView with 4 tabs
* **Tab Structure:**
    * Tab 1: Home (house.fill) → `HomeView`
    * Tab 2: Workouts (figure.strengthtraining.traditional) → `WorkoutsView`
    * Tab 3: Progress (chart.line.uptrend.xyaxis) → `ProgressView`
    * Tab 4: Profile (person.fill) → `ProfileView`
* **Sources Directory:** `Sources/Views/`
* **Asset Flow:** Stitch generates to `queue/` → Validate → Move to `Sources/Views/`

## 4. View Inventory (Current State)
*The Agent MUST update this section when a new view is successfully integrated.*

* [x] `ContentView` - Root TabView container with 4 tabs
* [x] `HomeView` - Dashboard with today's summary and quick-start workout button
* [ ] `WorkoutsView` - Browsable list of workout templates
* [ ] `ProgressView` - Charts and stats for workout history
* [ ] `ProfileView` - User profile, stats summary, and settings shortcut

## 5. The Roadmap (Backlog)
*If `next-prompt.md` is empty or completed, pick the next task from here.*

### High Priority
- [ ] **WorkoutsView:** Browsable list of workout templates grouped by muscle group.
- [ ] **WorkoutDetailView:** Drill-down view showing exercises, sets, and reps for a workout template.

### Medium Priority
- [ ] **ProgressView:** Line chart of weekly workout frequency with a monthly summary card.
- [ ] **ProfileView:** Avatar, display name, lifetime stats (total workouts, streak, PRs).

## 6. Creative Freedom Guidelines
*When the backlog is empty, follow these guidelines to innovate.*

1. **Stay On-Brand:** New views must fit the "Energetic + Clean + Data-forward" vibe.
2. **Enhance the Core:** Support the workout logging and progress tracking journey.
3. **Naming Convention:** PascalCase, always suffixed with `View`.

### Ideas to Explore
*Pick one, build it, then REMOVE it from this list.*

- [ ] `ActiveWorkoutView` - Live workout session with timer and set logging
- [ ] `ExerciseLibraryView` - Searchable catalog of exercises with instructions
- [ ] `AchievementsView` - Gamified milestone badges and streaks
- [ ] `SettingsView` - Units, notifications, and account preferences

## 7. Rules of Engagement
1. Do not recreate views in Section 4.
2. Always update `next-prompt.md` before completing.
3. Consume ideas from Section 6 when you use them.
4. Keep the loop moving.
