---
name: creating-effective-stitch-prompts
description: Use when writing, generating, or refining a text prompt for Stitch to generate or edit mobile or web application UIs
---

# Writing Stitch Prompts

## Overview

Stitch generates UIs for mobile and web applications from text prompts. Writing effective prompts requires focusing on specificity, thematic adjectives, and modular iteration.

## When to Use

- When writing a prompt to generate a new screen in Stitch
- When refining an existing Stitch screen design
- When a user asks for help crafting a prompt for a UI component or page
- When modifying an application theme (colors, typography, spacing) via Stitch

## Core Principles (Best Practices)

### 1. Iterative, Screen-by-Screen Development
**Do not attempt to build the entire app at once.**
- Focus on one screen or component at a time.
- Make only one or two adjustments per edit prompt. This allows for better control and easier debugging if a change doesn't meet expectations.

### 2. Specificity and Clarity
Tell Stitch "What" and "How". Clearly identify the element you want to change and the exact modification required.
- **Vague:** "Make the button better."
- **Specific:** "Change the primary call-to-action button on the login screen to be larger and use the brand’s primary blue color."

### 3. Setting the "Vibe" with Adjectives
Use descriptive adjectives to set the overall mood of the application. The adjectives directly influence the generated design system.
- **Colors:** Instead of just "blue", use mood modifiers ("deep ocean blue", "energetic neon cyan").
- **Fonts:** "Playful sans-serif", "elegant serif".
- **Imagery & Layout:** "Minimalist", "brutalist", "glassmorphism", "warm and inviting".

### 4. Balancing High-Level and Detailed Prompts
While high-level prompts work for initial ideas, explicitly describing core functionalities provides a more accurate and robust starting point for the design.
- **High-Level (Weak):** "An app for marathon runners."
- **Detailed (Strong):** "An app for marathon runners to engage with a community, find partners, get training advice, and find races near them."

### 5. Fine-Tuning the App Theme
You have granular control over the design system:
- **Colors:** Request specific named colors or mood-based palettes.
- **Borders & Shapes:** Explicitly modify element styling (e.g., "fully rounded corners", "2px solid border", "soft drop shadows").

### 6. Coordinating and Targeting Images
- **Theme Coordination:** When updating theme colors, explicitly specify if images should reflect those changes to maintain visual consistency.
- **Specific Image Targeting:** Use descriptive terms from the app's content to identify exactly which image to modify.
  - *Example:* "On the 'Team' page, for the image of 'Dr. Carter', update her lab coat to black."

## Examples: Good vs. Bad Prompts

### Generating a New Screen
- ❌ **Bad:** "Make a dashboard."
- ✅ **Good:** "A SaaS analytics dashboard for marketing teams. Dark mode with electric purple and cyan accents. Include a glassmorphism sidebar, a line chart showing weekly active users, and a data table with recent campaigns. The typography should use a clean, modern sans-serif."

### Editing an Existing Screen
- ❌ **Bad:** "Change the header."
- ✅ **Good:** "In the top navigation header, change the background to a frosted glass effect (backdrop blur) and make the logo text bold and slightly larger."

### Changing the Theme
- ❌ **Bad:** "Make it look cooler."
- ✅ **Good:** "Update the global theme to be more 'cyberpunk' and less 'corporate'. Use a dark background with high-contrast neon green borders on all cards, and change the primary font to a monospace typeface."

## Common Mistakes

- **Asking for too much at once:** Combining layout changes, theme changes, and copy changes in a single prompt often confuses the generation. Do them sequentially.
- **Being ambiguous about targets:** Say "the 'Submit' button in the footer" rather than "the button".
- **Forgetting the vibe:** Leaving out thematic adjectives results in generic, default-looking designs.
