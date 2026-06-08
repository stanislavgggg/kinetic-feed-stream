# Fixes

## 1. Rebrand PULSE → Kinetic Feed

`src/lib/brand.ts`:
- `name: "Kinetic Feed"`
- `wordmark: "KINETIC FEED"` (wordmark stays uppercase for the header lockup)

This automatically updates the header logo, footer, and any other consumer of `BRAND.name` / `BRAND.wordmark`. No other strings are hardcoded.

Optional polish in `src/components/Header.tsx`: since "KINETIC FEED" is longer than "PULSE", reduce the wordmark size from `text-[22px]` to `text-[18px]` so it doesn't crowd the right-side controls on iPhone 16/17 widths.

## 2. Fix "LIVE · BREAKING" overflow

Root cause in `src/components/Header.tsx`: the header is `-mx-4 px-4` (full-bleed with inner padding). `BreakingStrap` then applies another `-mx-4` on its wrapper, so the orange tape extends 16px past each edge of the viewport — visible as the tape disappearing off the left in the screenshot.

Fix: remove the redundant `-mx-4` from `BreakingStrap`'s outer `<div>` (line 65) and from the trailing `hr-gradient` on line 57. The header already provides the full-bleed context, so the strap should just be `relative overflow-hidden` and span its parent naturally.

Also add `pl-[max(env(safe-area-inset-left),0px)]` / `pr-[...]` to the strap's flex row so the tape clears notches in landscape — small safety net, no visual change in portrait.

## Out of scope
No changes to i18n strings, ticker logic, routes, or backend. Only `brand.ts` and `Header.tsx` are touched.
