# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 01-foundation
**Areas discussed:** Typography pairing, Film grain style, Layout structure, Token precision

---

## Typography Pairing

### Display Font

| Option | Description | Selected |
|--------|-------------|----------|
| Playfair Display | Classic luxury. High contrast thick/thin strokes. Very editorial — like a fashion magazine. | ✓ |
| Newsreader | More literary/intellectual. Designed for screens by Production Type. Less common. | |
| Cormorant Garamond | Elegant and airy. Lighter weight. Beautiful at massive scale. | |

**User's choice:** Playfair Display
**Notes:** Bold editorial energy. Instant premium read.

### Body Font

| Option | Description | Selected |
|--------|-------------|----------|
| Inter | Extremely legible, variable font, massive adoption. Clean pairing with Playfair. | |
| Space Grotesk | More personality. Geometric with techy edge. More distinctive. | ✓ |
| Manrope | Warm, modern, semi-rounded. Between Inter and Space Grotesk. | |

**User's choice:** Space Grotesk
**Notes:** Techy personality — gives the site a more distinctive feel than Inter.

---

## Film Grain Style

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle | Barely visible, opacity 0.03-0.05. Felt more than seen. Most luxury sites use this. | ✓ |
| Noticeable | Clearly visible grain, opacity 0.08-0.12. More editorial/artistic. | |
| Animated grain | Subtle opacity but pattern shifts every frame like real film. | |

**User's choice:** Subtle
**Notes:** Adds warmth without distraction. Good for long reading in docs too.

---

## Layout Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single page | One continuous scroll from hero to footer. How Lando Norris works. | |
| Multi-page | Separate routes per section. Page transitions between them. | ✓ |

**User's choice:** Multi-page
**Notes:** User wants important stuff on landing for recruiters, but expanded content (docs, detailed projects) on separate routes. "A simple navigation bar to take you to docs is enough."

---

## Token Precision

| Option | Description | Selected |
|--------|-------------|----------|
| Vivid violet | Bright, energetic. #a855f7 / #7c3aed / #c4b5fd. Modern tech feel. | ✓ |
| Royal purple | Deeper, muted. #8b5cf6 / #6d28d9 / #ddd6fe. Luxury/fashion feel. | |
| Electric indigo | Blue-shifted. #818cf8 / #6366f1 / #c7d2fe. Cyberpunk/futuristic. | |

**User's choice:** Vivid violet
**Notes:** Strong contrast on black, modern tech feel.

---

## Claude's Discretion

- Tailwind v4 config structure
- Responsive breakpoint values
- File organization within src/
- CSS custom properties vs Tailwind @theme

## Deferred Ideas

None
