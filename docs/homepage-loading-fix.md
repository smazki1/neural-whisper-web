# Homepage loading fix, local review only

Base: published production commit `a66f0626bd1580f4a1a32239b9e37bc5fd3bd81e`, confirmed successful GitHub/Vercel Production deployment `6556331996`. Worktree: `/Users/avifrid/.codex/worktrees/homepage-loading-fix/neural-whisper-web`, branch `codex/homepage-loading-fix`. Existing worktrees are untouched. No merge, push, deployment, database write or production setting change was performed.

## Review

- Clean production-build preview: http://127.0.0.1:4198/
- Local development version: http://127.0.0.1:4197/?hero=video
- Static fallback: http://127.0.0.1:4197/?hero=video&still=1
- Same layout with scroll effects disabled: http://127.0.0.1:4197/?hero=video&motion=off
- Frozen published baseline with measurement panel: http://127.0.0.1:4200/

Restart the clean preview with `npm run build && npm run preview -- --host 127.0.0.1 --port 4198 --strictPort`. The separate, local-only QA server is `../qa/server.mjs`; run with Node. It never ships with the app. Its scripts, request logs and measurement JSON files are in `../qa/`. Quality comparisons are in `../media-review/`. Screenshots are in `../screenshots/`.

## Changes

- VideoHero is eager, with no old Hero Suspense fallback. The previous layout remains DEV-only for comparison.
- Homepage HTML immediately renders a minimal poster/heading shell before the React bundle. React uses the same shared CSS, image URL, crop, section height and heading position. Other routes do not render this shell or preload its assets.
- One CSS background image is shared across the shell, loading, blocked-playback and failure states. The image is preloaded; the video is not separately preloaded through a second element/link. Using a CSS image also avoids the duplicate poster request observed with separate img/video poster consumers in the no-cache test.
- The existing Heebo bold face is served locally for the Hero only, preloaded once, avoiding a font swap in its opening heading. Its OFL license is included. Other typography is unchanged.
- The video source is attached once when visible and motion is allowed. Offscreen/hidden-page playback pauses; re-entry resumes the same source/current position. Ordinary pauses retain the buffer, so they do not restart network downloads. Browsers may continue filling their media buffer while paused; this change stops playback/decoding, not all buffering.
- Autoplay rejection and media errors leave the sharp poster. An observed playback starvation lasting 2.5 seconds switches permanently to the poster for that mount and releases the failed media request. There is no repeated retry loop. Slow initial loading keeps the poster without the old 15-second abandonment timer.
- HomepageMotion, mission artwork motion, entrance effects, content, catalogs, admin and business operations are unchanged.

## Media

- Original retained byte-for-byte: `avi-hero-0920-v2-1080p.mp4`, **33,120,852 bytes**, 1920×1080, 30fps, 37.167 seconds.
- New derivative: `avi-hero-web-1080p.mp4`, **9,284,839 bytes**, 1920×1080, 24fps, same duration, H.264 slow preset / CRF 28 / yuv420p / 48-frame GOP / faststart / no audio. **71.97% smaller**.
- Poster: `avi-hero-poster.jpg`, **79,596 bytes**, 1920×1080, extracted at 0.6 seconds. The first source frame contains an intentional blurred transition, so the sharp frame immediately after it was selected.
- Compared decoded frames and the rendered dark Hero. Sampled VMAF against the reference converted to the same 24fps: 93.79. This is a quality indicator, not losslessness or a guarantee across every device. Detail is slightly softer on close inspection; the rendered background retains good quality.

## Findings and validation

The published baseline reproducibly rendered the old Hero while loading its lazy replacement. Offscreen native video continued decoding at approximately 30fps (sample frames 877 to 1013 while outside the viewport). In the fixed version, currentTime and frame count remained unchanged throughout an offscreen sample (9.346s, 228 frames); returning resumed playback without resetting src.

Actual wheel scrolling with the existing effects versus `motion=off` produced the same measured 95th-percentile animation-frame interval, approximately 11.8ms. Samples contained 234 versus 221 frames and zero long tasks during scrolling. No consistent effects-related slowdown was reproduced on this Mac, so the effects were retained. These measurements do not prove the absence of device-specific slowdowns elsewhere.

Tested production builds at 1440×1000 and 390×844, including cold/no-store loads, repeat loads with cache enabled, blocked autoplay and midstream network starvation. Slow simulation uses a localhost HTTP server with a shared 200KB/s (~1.6Mbps) bandwidth budget, 150ms response latency and gzip for text assets. External fonts/API/YouTube hosts are not throttled by that server. Mobile is viewport emulation, not a physical phone or CPU-throttled handset.

- Cold normal desktop: poster ~77ms, first playing ~147ms. Mobile: ~54ms / ~110ms.
- Cold slow desktop: poster ~1.91s, first playing ~4.40s. Mobile: ~1.85s / ~4.46s.
- Repeat loads with the slow server: poster ~276ms desktop and ~205ms mobile, with zero transferred image/font bytes from resource timing. Video starts ~2.42s / ~1.12s. Media caching remains browser-managed; no claim that every navigation avoids a media transfer.
- No old Hero was detected in any fixed run. The Hero geometry had exactly one measured state from the HTML shell through playback: desktop height 820px, heading offset 593.22px; mobile height 675.19px, heading offset 493.23px. No blank Hero, visible Hero jump or horizontal page overflow was observed.
- Whole-document CLS was 0 to 0.018, not universally zero; the Hero/heading rectangles stayed unchanged. This is not a claim that every other page element has zero layout shift.
- One poster transfer and one font transfer on final cold loads. No separate video preload, duplicate source assignment or source reload on scroll re-entry. The browser uses a normal byte-range media request. Hard reloads can request media again.
- Simulated NotAllowedError leaves poster, muted/paused video and no src. A server sending the first 512KB then stalling for 12s triggered `slow-connection`, paused playback and aborted the remaining transfer after ~5s. The page remained readable. Short buffering pauses can still occur on links slower than the video's ~2Mbps average bitrate.
- TypeScript application check, focused ESLint, production build and diff whitespace check passed. No unrelated database/integration tests were run.

Next authorized step: owner reviews this local result. Publishing is explicitly not authorized for this task.
