# ForgeAI — AI-Powered 3D Game Asset Generator

> Describe a game object in plain English → AI generates it as an interactive 3D model → Export to your game engine.

## Tech Stack

- **Next.js 14** — App Router + TypeScript
- **React Three Fiber** — 3D rendering in React
- **@react-three/drei** — Helpers (OrbitControls, etc.)
- **Three.js** — Geometry + GLTFExporter
- **Claude API** (claude-sonnet-4-5) — AI code generation
- **Tailwind CSS** — Styling
- **JSZip** — Batch export

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url> forge-ai
cd forge-ai

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local and add your Anthropic API key

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Select a Style** — Choose from 6 game art styles (Low-Poly Medieval, Neon Cyberpunk, etc.)
2. **Describe Your Asset** — Type a plain English description (e.g., "a wooden barrel")
3. **AI Generation** — Claude generates Three.js geometry + material code matching your style
4. **3D Preview** — The code is safely executed client-side and rendered via React Three Fiber
5. **Export** — Download as `.glb` for Unity, Godot, Blender, or any glTF-compatible engine

No external 3D APIs — everything is self-contained. Claude writes Three.js code that creates geometry procedurally.

## Features

- 🎨 6 distinct game art styles with consistent theming
- ✨ AI-enhanced prompts for better results
- 🖥️ Interactive 3D viewer with orbit controls
- 🔧 Wireframe toggle, background switcher, screenshot capture
- 📦 Export as .glb with engine-specific guidance
- 🗂️ Asset shelf with localStorage persistence (up to 20 assets)
- 📁 Batch export all assets as ZIP
- 🌑 Premium dark UI with glassmorphism

## Roadmap

| Phase | Feature |
|-------|---------|
| ✅ 1 | Core generator + viewer + export |
| 2 | Authentication + cloud database |
| 3 | Image-to-3D generation |
| 4 | Scene builder (compose multiple assets) |
| 5 | Public gallery + community sharing |

## License

MIT
