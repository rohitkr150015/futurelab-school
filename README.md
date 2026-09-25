# FutureLab School

React, TypeScript and Vite school website with responsive public pages, interactive campus and learning experiences, admissions previews and family workflows.

## Run locally

Use Node.js 24.x. From the repository root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Build

```sh
npm run build
```

The deployable website is generated in `dist/`. Source, test and local presentation files are not published as website pages.

## Deploy on Vercel

Import this GitHub repository as its own Vercel project. Use the repository root (`./`) as Root Directory. The checked-in `vercel.json` sets:

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Node.js | 24.x (set in package.json) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |

SPA rewrites are included so direct visits and refreshes on routes such as /campus and /admissions/apply resolve to the app.

No environment variables or API keys are needed for the current frontend demo. This repository is prepared for deployment; importing it in Vercel creates the actual hosted project.

Configuration references: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [project configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Project scope

This is a fictional school frontend demonstration. Role selection, school records, forms, payments, bookings and AI-style assistance are local previews or curated examples where present. Real authentication, private storage, ERP/provider connections and model-backed AI need server implementation. Retain the demo labels when showcasing the current version.

## Development checks

Run npm run typecheck and npm test. Browser tests are available through npm run test:e2e and require the configured browser.

## Assets and licenses

[Asset sources](ASSETS.md) records supplied media provenance. Retain the license files included with the source and fonts. Original school photographs are illustrative; they are not a claim about a real campus.

## Interaction effects

A compact brand intro fades out after 540 ms without delaying page rendering or intercepting input. Clickable cards, image links, navigation, buttons and section headings receive subtle hover/focus/press or entrance feedback. A thin reading-progress line follows page scroll. Effects respect reduced-motion preferences; the static sites also honor their Motion toggle. The small dependency-free implementation is in `public/effects/`.
