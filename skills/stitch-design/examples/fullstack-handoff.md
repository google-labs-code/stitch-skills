# Example: Full-Stack Handoff Note

Use a note like this after the design direction is accepted and the next step is implementation.

## Design Status
- Project: `market-insights-web`
- Target: desktop landing page plus pricing page
- Design system source: `.stitch/DESIGN.md`
- Accepted screens: `landing-v2`, `pricing-v1`
- Stored artifacts: `.stitch/designs/landing-v2.html`, `.stitch/designs/pricing-v1.html`

## Recommended Next Step
- Use `stitch-loop` if the project should continue through integration, browser QA, review, fix, and retest
- Use `react:components` if the main task is converting accepted Stitch output into modular React components

## Implementation Notes
- Preserve the sticky top navigation and hero spacing from the accepted landing page
- Keep card corner radius and CTA color consistent with `.stitch/DESIGN.md`
- Add loading, empty, and error states that were not explicit in the design export
- Verify the integrated result in a real browser before calling the slice done
