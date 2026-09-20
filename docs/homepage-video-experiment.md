# Local homepage review

Worktree: `/Users/avifrid/.codex/worktrees/homepage-video-experiment/neural-whisper-web`  
Branch: `codex/homepage-video-experiment`  
Run: `npm run dev -- --host 127.0.0.1 --port 4184 --strictPort`

## Review URLs

- Previous homepage layout: http://127.0.0.1:4184/
- Updated homepage with existing published data: http://127.0.0.1:4184/?hero=video
- Complete visual preview, existing course plus local workshop examples: http://127.0.0.1:4184/?hero=video&catalog=demo
- One item in each catalog: http://127.0.0.1:4184/?hero=video&catalog=single
- Multiple items (the same existing course repeated only for layout testing): http://127.0.0.1:4184/?hero=video&catalog=multiple
- Empty catalogs: http://127.0.0.1:4184/?hero=video&catalog=empty
- Static Hero: http://127.0.0.1:4184/?hero=video&still=1

The query gates require Vite DEV. There is no public comparison toggle. The baseline retains the previously approved intro copy and hidden events link. The experiment hides About; its route remains intact. The shared navigation hides About on other routes as requested. Baseline home retains About for comparison.

## Homepage

The video Hero includes the existing main heading, the exact approved supporting message and two links. The first scrolls to courses with navigation clearance (falls back to the existing products page if no courses exist); the second opens `/corporate-workshops`. The old repeated call-to-action section, coming-soon resources and mixed events/products section are excluded from the experiment.

Mission copy is unchanged from the supplied text and uses a bright background, readable navy text, and the existing portrait. The testimony section uses the exact approved heading and paragraph. Three official YouTube embeds are activated only by a click. They use a 9:16 frame with controls and sound. Only the active iframe is mounted; a slide change destroys it, stopping playback. Arrows, position buttons, keyboard arrows and drag/swipe are available. The native player consumes gestures inside itself while playing; the external controls remain available. No invented quotes, names, ratings or claims were added.

The blue/gold original artwork is behind the course catalog. The organization catalog is bright. Empty catalogs render nothing. No new vault marketing section is present; vault links remain in navigation and the experiment footer.

## Video source

Retained the owner's most recently selected high-quality `0920 (1).mp4`, rather than silently reverting to the old YouTube Hero mentioned in the pasted spec. A clarification was offered during work. The previous YouTube experiment was confirmed to auto-select 360p; the local file avoids this quality problem. No YouTube video was downloaded.

Original: `/Users/avifrid/Downloads/0920 (1).mp4`, unchanged. The derivative `src/assets/experiments/avi-hero-0920-1080p.mp4` is H.264, 1920×1080, 30fps, 36.8 seconds, CRF18, yuv420p, faststart, no audio track, 32.9 MB. Muted autoplay, inline playback and loop are retained. Reduced-motion preferences, errors and blocked playback retain the original static artwork. This is a local visual review; no deployment or asset hosting was performed.

## Existing data and management

The real catalog reads existing `products` records using `is_published = true`. Course classification is `product_type = course`; organization classification is `product_type = workshop` plus `category = business`. Consultations, prompt packs and non-business workshops are not placed into either catalog. `is_featured` is not required. Order comes from `display_order`, then newest creation. Refetch occurs on focus and every 30 seconds while the real catalog is open. No Realtime publication setting is required.

Cards use existing title, image, short_description (description fallback), persona where present, and external_url or the existing `/products/:slug` destination. No prices are displayed. A public read returned one published course (`ai-for-business`) and no published organization workshops. Its detail page was opened and verified; no purchase action was taken.

The existing AdminProducts form now exposes product type and the existing `persona` field as optional audience. The existing nullable category is preserved when editing a course with no category. The form explains that a published workshop with business category enters the organization catalog. Lectures share the existing workshop family; no new enum or schema is needed. The existing publication switch and save path remain in use. No admin save, upload or toggle against real records was performed.

The present CorporateWorkshops page stores its six offers in code, not product records. Local `catalog-preview.ts` copies three existing titles, descriptions and images solely for DEV review and links to that existing page. It is not a production data source or management system. To populate the real organization catalog later, an authorized user must enter/publish those offers through the existing management form. No DB migration is required for the current mapping.

## Validation

- Build and application TypeScript check passed.
- Four focused tests cover publication/unpublication, category/type separation, order, link destinations and description fallback.
- Actual local Hero reports 1920×1080 and muted playback.
- All three testimony embeds were played in Chrome with muted=false and paused=false. Switching removed the prior iframe.
- Hero links and course detail destination checked without forms, purchases or business operations.
- Desktop at 1440px and mobile at 390px checked for complete text and no page overflow.
- Mobile menu Enter/Escape, testimony keyboard navigation, position buttons and drag/swipe tested.
- One, multiple and empty catalog variants are available without record changes.
- Full-page review screenshots: sibling `screenshots/homepage-desktop-full.png` and `screenshots/homepage-mobile-full.png`. These intentionally show the marked local demo, including workshop examples.

No merge, deployment, production configuration, Database write, learning-system change, checkout change, vault-project change, or new Codex task. Next step: owner reviews the local result; no publishing is authorized.

## Focused refinement, 20 September 2026

- Current refinement: http://127.0.0.1:4184/?hero=video&catalog=demo
- Frozen pre-refinement experiment: http://127.0.0.1:4194/?hero=video&catalog=demo
- Snapshot source is a local copy at `../homepage-before-refinement`; its Vite server runs on port 4194. Restart with `npm run dev -- --host 127.0.0.1 --port 4194 --strictPort` from that folder. No new task, branch, or deployment was created.
- Hero keeps the existing native MP4/playback logic and only its heading. Mission now uses the original blue/gold artwork, gold heading, light full copy, larger desktop portrait and content-driven mobile height. A separate direction section follows it.
- Testimonials use a 64% gallery column (excluding the gap), two portrait cards on desktop, one plus a peek on medium/mobile widths, numbered selection, reduced-motion-aware transitions, and only one mounted YouTube iframe. Dragging or selecting another testimony stops the previous player. Near-invisible slides are removed from the tab order and playing slides leaving the gallery are unmounted.
- Thumbnail checks: all three `maxresdefault.jpg` URLs returned 1280×720, versus 480×360 for the previous `hqdefault.jpg`. The actual centered portrait is approximately 405×720 in the large image. CSS crops only the surrounding side fill, not the portrait. The HQ fallback inspected for these Shorts also contains a full-height centered portrait (approximately 203×360), so the fallback uses the same centered cover fit without additional zoom. The component falls back from maxres to SD to HQ on errors or small placeholder responses.
- Playback was checked separately through all three official embedded players in Chrome: each delivered 1080×1920 with sound after clicking. This is an observed YouTube selection, not a forced or guaranteed resolution. No YouTube video was downloaded. For still sharper posters at high pixel density, supply one 1080×1920 portrait JPG/WebP per testimony (QjkZ96r6DmU, D16zprjUmuQ, G9lYVvp6keE).
- Verified at 1440×1000, 900×1000 and 390×844 viewport sizes: responsive layout, no page horizontal overflow, full approved copy, courses anchor, existing corporate destination, native hero mute/loop, all three testimony players, removal of previous iframe, mobile keyboard selection and swipe while playing. Mobile checks use Chrome viewport emulation, not a physical handset.
- TypeScript check, Vite build and `git diff --check` passed. Comparing source against the frozen copy shows only VideoHero, Testimonials, their scoped CSS, the new DirectionSection and its insertion into Index changed. Catalogs, fixtures, their shared logic and admin code are byte-identical to the pre-refinement state. No database or production changes.
- Screenshots in the sibling `screenshots` directory: `refined-desktop-full.png`, `refined-mobile-full.png`, `refined-testimonials-desktop.png`, `refined-testimonials-mobile.png`.

### Hero to mission transition

The Hero now fades over its final 140px (80px on mobile) into #081d34. A continuous masked mission artwork layer overlaps that same area. Section positions and existing content padding are unchanged; there is no added spacer, blur or animation. Checked with actual scrolling in desktop/mobile viewports while the native video played, including its bright white-wall opening and workshop footage. Text remains outside the masked layer. Previous CSS saved locally at `../hero-mission-before-transition.css`. Vite build and diff whitespace checks passed.

### Latest Hero video replacement

Source: `/Users/avifrid/Downloads/0920 (1)(1).mp4`. Current asset: `src/assets/experiments/avi-hero-0920-v2-1080p.mp4`, 1920×1080 at 30 fps, 37.167 seconds, H.264 CRF 18, no audio track, faststart. The previous video is preserved at `../avi-hero-0920-before-v2-1080p.mp4` and in the frozen comparison copy. No layout or playback logic was changed.

### Subtle scroll motion, 20 September 2026

- Tightened section spacing before adding motion: desktop section padding 80px, mission 104px/88px, direction 80px and 48px heading-to-actions gap; mobile section padding 56px, mission 72px/56px. Existing content and catalog/admin logic unchanged.
- Seven content groups in the local demo reveal once with a 20px entrance over 520ms, with a 70ms media delay. Observer starts 40px above the viewport bottom. Already visible content and keyboard-focused content are shown immediately.
- Only the desktop mission artwork moves, limited to ±18px with overscan. Text, mask/seam and actual scroll position remain unchanged. No background movement on mobile.
- DOM content is visible by default. Reduced-motion preference disables both new effects; live preference changes cancel pending animations. Local comparison without these effects: http://127.0.0.1:4184/?hero=video&catalog=demo&motion=off . No public switch or saved preference is added.
- Actual scrolling through the complete sequence checked at 1440×1000 and 390×844, including returning upward: entrances occur once, all groups settle fully visible, no page horizontal overflow, no testimony players or carousel movement start from scrolling. Desktop artwork offset changed while mobile artwork stayed fixed.
- No-effects URL checked: all seven groups fully visible with no translation or artwork offset. OS reduced-motion emulation was not completed; its code path and CSS were reviewed. Mobile verification is viewport emulation, not a physical handset.
- TypeScript, git diff whitespace check and Vite build passed. Screenshots: ../screenshots/motion-desktop.png and ../screenshots/motion-mobile.png. Pre-motion Index/CSS copies: ../before-scroll-motion/.
- No merge, deployment, database write, production setting change or new task.

## Publication preparation, 20 September 2026

The owner explicitly approved publishing the reviewed homepage. This supersedes the local-only publication restriction in the historical entries above. Production now enables the reviewed homepage at `/`; query-based examples and their notice remain DEV-only. Production catalogs read existing published records. No data or production configuration changes are part of this release.

The latest `origin/main` was merged into the existing worktree branch before release, preserving intervening production changes. The final review also removed testimony number controls and the external YouTube link, and updated the footer year to 2026. Keyboard and drag navigation remain available. Local original/experiment comparison URLs still work.
