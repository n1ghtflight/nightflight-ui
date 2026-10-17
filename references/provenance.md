# Where the values come from (and how to re-measure)

## Source
The surface, border, text, accent, type-scale, weight, geometry and motion values were **measured** from a
best-in-class productivity app (desktop build, dark theme, logged-in workspace) and used as a reference for the
*design spirit* only. The values were read from the running UI's computed styles and custom properties — the
raw numbers (sizes, colour values, timings), not any brand identity. Light-theme values come from the app's
`*-light` custom properties plus derived steps. Status colours, spacing scale, `--r-lg`, `--h-control-lg`,
`--shadow-pop` and `--overlay` are derived.

## Measured facts worth remembering
- Depth: base/sidebar `#09090a`, raised work surface `#121213` with a 1-device-pixel border (computed
  `0.666667px` at 1.5× DPR) and shadow `0 .5px 1px 1px lch(0 0 0 / .3)`.
- Colours are LCH with hue 272 and chroma ≤ 1.5: cool, almost neutral greys.
- Body weight 450 (variable Inter); 500 medium; 600 semibold. Content 15px, UI 13px.
- Sidebar 244px, title/tab bar 42px, view header 43px, nav rows and icon buttons 28px, radius 8px.
- Transitions 100/150/250/350ms; hover transitions 150ms.
- Compiler-generated atomic/hashed CSS variables are not design tokens. Ignore them.

## Rules carried forward
- This is an *inspired-by* house style. Never use the reference app's name, logo, icons, illustrations, copy
  or other assets in a product. Measured numbers (sizes, colour values) are fine; brand identity is not.
- First adopter: XPerf kept its own aviation colours layered on top of these tokens. That's the pattern for
  domain colours — build your palette on the base tokens rather than replacing them.

## Re-measuring (if the reference app changes, or to study another app)
Read the current custom properties (`--*`) from `html` and `body`, and the computed styles for the named
elements (sidebar, main surface, nav item, list row, icon button, link). Update `assets/tokens.css`, the hex
table in `references/platforms.md` (convert lch → sRGB, checking against any hex the app itself publishes), and
bump the version comment.
