# SICE Logo Package

Brand assets for the South Indian Creator Economy.

## What's in this package

### PNG files (for direct use)

| File | Dimensions | Use |
|------|-----------|-----|
| `sice-logo-primary.png` | 1920×1080 | Hero image, website banner, primary brand display |
| `sice-logo-social-square.png` | 1080×1080 | Instagram, profile pictures, square avatars |
| `sice-logo-og-share.png` | 1200×630 | Open Graph image for social link previews (WhatsApp, Twitter, LinkedIn) |
| `sice-logo-transparent-cream.png` | 1600×800 | Logo on transparent background — for overlaying on photos, videos, dark backgrounds |
| `sice-logo-dark.png` | 1600×800 | Logo on transparent background in dark color — for use on cream, white, or light surfaces |
| `sice-logo-favicon-512.png` | 512×512 | Source for favicon — downscale to 32px, 16px as needed |
| `sice-logo-wordmark-only.png` | 1200×500 | Compact wordmark without tagline — for tight spaces, navigation bars |

### SVG files (for production)

The SVG files are the source of truth — they scale to any size without quality loss. Use these whenever possible.

| File | Use |
|------|-----|
| `svgs/sice-logo-primary.svg` | Full lockup with atmospheric background — for hero images |
| `svgs/sice-logo-transparent-cream.svg` | Full lockup, transparent background, cream wordmark |
| `svgs/sice-logo-transparent-dark.svg` | Full lockup, transparent background, dark wordmark — for light backgrounds |
| `svgs/sice-logo-wordmark-only.svg` | Wordmark with rules but no tagline |

## Brand colors

| Color | Hex | RGB | Use |
|-------|-----|-----|-----|
| Studio Indigo | `#080D26` | 8, 13, 38 | Primary background |
| Indigo Soft | `#141A3A` | 20, 26, 58 | Atmospheric glow |
| Cream | `#F0EBE0` | 240, 235, 224 | Wordmark on dark |
| Signal Gold | `#C8A968` | 200, 169, 104 | Accent on dark |
| Gold Deep | `#A8884A` | 168, 136, 74 | Accent on light |

## Typography

- **Wordmark**: Bricolage Grotesque SemiBold (weight 600), letter-spacing −0.05em
- **Tagline**: Inter Medium (weight 500), letter-spacing +0.42em (UPPERCASE)

> Note: The PNG files in this package were rendered using Poppins Bold as a fallback because the rendering environment did not have Bricolage Grotesque available. For production use, the SVG files reference Bricolage Grotesque via Google Fonts and will render correctly in any modern browser or design application that loads Google Fonts. If you need the PNGs re-rendered with the correct Bricolage Grotesque, that can be done in a properly configured design tool (Figma, Illustrator, or Photoshop with the font installed).

## Logo lockup structure

The signature SICE lockup has four parts in fixed order from top to bottom:

1. **Top rule with dot** — a short gold line, gold dot, short gold line
2. **Wordmark** — "SICE" in Bricolage Grotesque SemiBold, cream on dark
3. **Bottom rule** — a full-width thin gold horizontal line
4. **Tagline** — "SOUTH INDIAN CREATOR ECONOMY" in wide-tracked uppercase

These four elements must always appear in this order, in these proportions. Do not rearrange.

## Clear space and minimum size

- Maintain clear space equal to the height of one "S" character on all sides of the lockup
- Minimum width for the full lockup with tagline: 200px
- Below 200px, use the wordmark-only variant
- Below 80px, use only the wordmark in a single line without rules
