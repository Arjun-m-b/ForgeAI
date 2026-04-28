# ForgeAI — AI-Powered 3D Game Asset Generator

Build a complete, self-contained web app where indie devs describe game assets in plain English, Claude generates Three.js geometry code, and the resulting 3D model is rendered interactively in the browser with GLB export support.

## Proposed Changes

### Project Setup

#### [NEW] [package.json](file:///f:/indie_3d/package.json)
Next.js 14, React 18, React Three Fiber, drei, Three.js, Anthropic SDK, JSZip, uuid, TypeScript, Tailwind CSS, and all type packages.

#### [NEW] [.env.local.example](file:///f:/indie_3d/.env.local.example)
`ANTHROPIC_API_KEY=your_anthropic_api_key_here`

#### [NEW] [README.md](file:///f:/indie_3d/README.md)
Description, tech stack, setup instructions, how it works, features, roadmap.

#### [NEW] [tsconfig.json](file:///f:/indie_3d/tsconfig.json)
Standard Next.js 14 TypeScript config.

#### [NEW] [next.config.mjs](file:///f:/indie_3d/next.config.mjs)
Minimal Next.js config with transpilePackages for Three.js ecosystem.

#### [NEW] [tailwind.config.ts](file:///f:/indie_3d/tailwind.config.ts)
Extended color palette per the spec's design system, Space Grotesk + Inter fonts.

#### [NEW] [postcss.config.mjs](file:///f:/indie_3d/postcss.config.mjs)
Standard Tailwind PostCSS config.

---

### App Shell

#### [NEW] [app/globals.css](file:///f:/indie_3d/app/globals.css)
Tailwind directives, CSS variables for the full color system, custom scrollbar, animations (shimmer, float, pulse-ring), selection styling.

#### [NEW] [app/layout.tsx](file:///f:/indie_3d/app/layout.tsx)
Root layout with Space Grotesk + Inter via `next/font/google`, dark body background, metadata.

---

### Core Libraries

#### [NEW] [lib/promptBuilder.ts](file:///f:/indie_3d/lib/promptBuilder.ts)
`buildStylePrompt()` — injects style keywords, `enhancePrompt()` — one-line enhancement.

#### [NEW] [lib/codeRunner.ts](file:///f:/indie_3d/lib/codeRunner.ts)
`safeExecute()` — strips markdown, uses `new Function()` to execute Claude-generated Three.js code.

#### [NEW] [lib/exportHelpers.ts](file:///f:/indie_3d/lib/exportHelpers.ts)
`exportAsGLB()` via GLTFExporter, `exportAllAsZip()` via JSZip.

#### [NEW] [lib/storage.ts](file:///f:/indie_3d/lib/storage.ts)
`saveAsset()`, `loadAssets()`, `deleteAsset()`, `clearAssets()` + `Asset` type definition.

---

### API Route

#### [NEW] [app/api/generate/route.ts](file:///f:/indie_3d/app/api/generate/route.ts)
POST handler: validates input → calls Claude with system prompt → returns `{ code, enhancedPrompt }`. 500ms minimum delay for loading UX.

---

### UI Components

#### [NEW] [components/StyleSelector.tsx](file:///f:/indie_3d/components/StyleSelector.tsx)
6 style cards with accent colors, selected state, change triggers session clear confirmation.

#### [NEW] [components/PromptPanel.tsx](file:///f:/indie_3d/components/PromptPanel.tsx)
Textarea, 10 example chips, character counter, Ctrl+Enter shortcut, enhanced prompt tag display.

#### [NEW] [components/ForgeCanvas.tsx](file:///f:/indie_3d/components/ForgeCanvas.tsx)
R3F Canvas with OrbitControls, lighting rig, grid floor, wireframe toggle, background switcher, screenshot button, placeholder/loading states.

#### [NEW] [components/LoadingOverlay.tsx](file:///f:/indie_3d/components/LoadingOverlay.tsx)
4-step progress with animated dots, progress bar, shimmer background, error state with retry.

#### [NEW] [components/AssetShelf.tsx](file:///f:/indie_3d/components/AssetShelf.tsx)
Horizontal scrollable bar, 160×120 cards with thumbnail/name/badge/timestamp, click to reload, hover delete, Export All via JSZip, localStorage persistence, 20-asset limit.

#### [NEW] [components/ExportPanel.tsx](file:///f:/indie_3d/components/ExportPanel.tsx)
GLB export button, engine presets (Unity/Godot/Blender), file size estimate, copy prompt, disabled state.

---

### Main Page

#### [NEW] [app/page.tsx](file:///f:/indie_3d/app/page.tsx)
Client component orchestrating all state (`currentObject`, `isLoading`, `error`, `selectedStyle`, `assets`, `enhancedPrompt`) and the full generate flow: API call → safe execute → render → save to shelf.

---

## Verification Plan

### Automated Tests
1. Run `npm run build` in `f:\indie_3d` to confirm no TypeScript or build errors.

### Browser Verification
1. Run `npm run dev`, open `http://localhost:3000`
2. Verify the full visual layout loads (left panel, right canvas, bottom shelf, header)
3. Select a style → type a prompt → click Generate → verify loading overlay → verify 3D object appears
4. Rotate/zoom the 3D model with mouse
5. Test wireframe toggle, background switcher, screenshot
6. Verify asset appears in shelf
7. Test GLB export download
8. Refresh page and verify assets persist from localStorage
