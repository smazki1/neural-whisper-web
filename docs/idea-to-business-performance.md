# Landing page performance check, 2026-09-30

Measured the existing worktree before changes and the optimized production build locally. No merge or deployment.

## Comparable measurements

Same browser, production bundles served by the same local HTTP server implementation on separate ports, local assets with `Cache-Control: no-store`, the same warm external-font cache, and a fixed five-second initial-load sampling window. No CPU/network throttling. Mobile means a 390×844 responsive viewport, not a physical phone. Desktop was 1440×900.

| Initial measurement | Desktop before | Desktop after | Mobile before | Mobile after |
| --- | ---: | ---: | ---: | ---: |
| Transferred resource bytes | 31,130,473 | 1,164,376 | 5,577,763 | 1,164,376 |
| Resource requests | 60 | 41 | 45 | 41 |
| LCP | 1,488 ms | 1,484 ms | 1,316 ms | 1,356 ms |
| CLS | 0.0105 | 0.0105 | 0.0178 | 0.0178 |
| Offscreen decorative loops running | 12 | 0 | 9 | 0 |

Transferred bytes fell 96.3% on desktop and 79.1% on mobile in these runs. LCP and CLS were effectively unchanged; there is no claim of a measured LCP improvement or a real-device/production speed score. Native image lazy loading fetched significantly more of the original gallery on desktop; explicit proximity loading now makes that behavior predictable. Other exploratory runs fetched fewer original images, so the desktop percentage is specific to the controlled run above.

## Targeted changes

- Three landing-only WebP backgrounds: 2,891,008 bytes to 171,920 bytes. Other pages still use their existing assets.
- Audience photographs: responsive 800/1600px versions (1200px for the smaller portrait), WebP quality 90. EXIF orientation normalized and Display P3 profiles retained. Originals remain untouched.
- All five testimonial previews: lossless WebP at original dimensions. Decoded RGBA pixels checked equal to the original PNGs; full-size links still open the originals.
- Image dimensions reserve space. Gallery/testimonial sources attach within 1,000px of the viewport; hidden mobile gallery photos are not fetched.
- Demo videos and posters attach within 600px. The four videos were already small, 228–418KB each at 1280px, so they were not re-encoded at lower quality. Existing muted loops and offscreen reset remain intact.
- Decorative CSS loops pause outside the viewport and in a hidden tab. The two narrative animations already cancel their JavaScript timers/frames offscreen; their runtimes and visible timelines were not changed.
- Fonts are not duplicated: one Heebo stylesheet and one Noto Sans Hebrew stylesheet shared by both narrative animations. Existing route splitting already avoids loading the other page bundles. No broad infrastructure or shared-bundle rewrite.

## Validation

- Production build, TypeScript, scoped ESLint, and diff whitespace checks.
- Desktop/mobile visual comparisons, matching audience image boxes and crops, readable lossless testimonials, and no horizontal overflow.
- All four demos start on activation, play muted inline without controls, loop, and reset to their poster when leaving the viewport. Keyboard activation checked.
- Both narrative animations activate on entry and retain their loops. Offscreen decorative CSS reports paused.
- Hero still centers the previously approved possibilities introduction and first card. At 1440×900, their bounds were 257.6–642.6px; at 390×844, 205.3–638.1px.
- Both checkout links remain `https://app.icount.co.il/m/3a86b`; no purchase was made.
- No browser console errors observed. The temporary metrics overlay/script was confined to local test builds and is absent from the final build.

Pending clarification: the new performance brief says automatic demo playback and Hero-to-purchase, while the immediately preceding specific instructions selected click-to-play and Hero-to-possibilities. This performance change preserves the latter behaviors until clarified.
