# ForgeAI

**ForgeAI** is an AI-powered web application that transforms natural language descriptions into interactive 3D game assets. By leveraging  AI for procedural Three.js code generation, the application enables developers, designers, and game enthusiasts to rapidly prototype assets directly within the browser and export them in industry-standard formats.

---

# Overview

Creating game-ready 3D assets traditionally requires extensive knowledge of modeling software and significant development time. ForgeAI simplifies this process by allowing users to describe an object in plain English while the application generates the corresponding procedural geometry automatically.

The generated model is rendered in real time using Three.js and React Three Fiber, allowing immediate visualization, interaction, and export without requiring external modeling software.

ForgeAI is designed primarily for:

- Indie game developers
- Rapid prototyping
- Game design students
- Technical artists
- Three.js developers
- AI-assisted asset generation workflows

---

# Key Features

## AI-Powered Asset Generation

ForgeAI accepts natural language prompts and converts them into procedural Three.js geometry using Claude AI.

Example:

```
A medieval wooden barrel reinforced with iron bands
```

The application automatically:

- Enhances the prompt
- Applies the selected visual style
- Generates Three.js geometry code
- Renders the asset instantly

---

## Style-Based Asset Generation

Assets can be generated using multiple predefined artistic styles.

Supported styles include:

- Low Poly Medieval
- Neon Cyberpunk
- Stylized Fantasy
- Science Fiction
- Cartoon
- Modern Minimal

Each style injects specialized instructions into the AI prompt to maintain visual consistency.

---

## Interactive 3D Workspace

Generated models are displayed inside a fully interactive viewport powered by React Three Fiber.

Features include:

- Orbit controls
- Zoom and pan
- Dynamic lighting
- Grid floor
- Real-time rendering
- Background switching
- Wireframe visualization

---

## Prompt Enhancement

Before the request is sent to Claude AI, ForgeAI automatically enriches the user's prompt by incorporating:

- Additional geometric details
- Material suggestions
- Style-specific characteristics
- Procedural modeling guidance

This produces significantly more consistent AI-generated assets.

---

## Asset Shelf

Every generated asset is automatically stored locally.

Capabilities include:

- Persistent local storage
- Asset history
- Instant reloading
- Asset deletion
- Maximum capacity of 20 saved assets

---

## GLB Export

Generated models can be exported as GLB files using the Three.js GLTFExporter.

The exported assets are compatible with:

- Unity
- Unreal Engine
- Godot
- Blender
- Babylon.js
- Three.js

---

## Batch Export

Multiple generated assets can be packaged into a ZIP archive using JSZip for convenient project integration.

---

## Screenshot Capture

The viewport can be captured directly as an image, allowing quick previews without external screen capture software.

---

## Modern User Interface

ForgeAI provides a responsive interface built with Tailwind CSS featuring:

- Dark theme
- Responsive layout
- Loading animations
- Real-time progress indicators
- Minimal and distraction-free workspace

---

# System Architecture

```
                    User Prompt
                         │
                         ▼
                Prompt Enhancement
                         │
                         ▼
                 Claude AI API
                         │
                         ▼
         Three.js Geometry Code Generation
                         │
                         ▼
             Safe Runtime Code Execution
                         │
                         ▼
          React Three Fiber Rendering
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
     Asset Shelf                 GLB Export
```

---

# Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Frontend | React 18 |
| Styling | Tailwind CSS |
| AI Integration | Anthropic Claude SDK |
| 3D Rendering | React Three Fiber |
| Graphics Engine | Three.js |
| Utilities | Drei |
| Export | GLTFExporter |
| Compression | JSZip |
| Storage | Browser LocalStorage |

---

# Application Workflow

1. Select a preferred artistic style.
2. Enter a natural language description of the desired object.
3. ForgeAI enhances the prompt.
4. The enhanced prompt is sent to Claude AI.
5. Claude generates procedural Three.js code.
6. The generated code is safely executed.
7. React Three Fiber renders the resulting model.
8. The asset is automatically saved locally.
9. Export the model as GLB or include it in a ZIP archive.

---

# Project Structure

```
ForgeAI
│
├── app
│   ├── api
│   │   └── generate
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── AssetShelf.tsx
│   ├── ExportPanel.tsx
│   ├── ForgeCanvas.tsx
│   ├── LoadingOverlay.tsx
│   ├── PromptPanel.tsx
│   └── StyleSelector.tsx
│
├── lib
│   ├── codeRunner.ts
│   ├── exportHelpers.ts
│   ├── promptBuilder.ts
│   └── storage.ts
│
├── public
│
├── package.json
└── README.md
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/Arjun-m-b/ForgeAI.git
```

Navigate into the project.

```bash
cd ForgeAI
```

Install dependencies.

```bash
npm install
```

---

# Environment Variables

Create a `.env.local` file.

```env
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY
```

---

# Running the Application

Start the development server.

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# Usage

Example prompts:

```
A medieval treasure chest

A futuristic plasma rifle

A wooden bridge

A glowing magic crystal

A cyberpunk vending machine

A stone pillar covered with vines
```

Select a style, generate the model, inspect it in the viewport, and export it when satisfied.

---

# Export Support

ForgeAI exports assets in the GLB format, making them immediately usable in common game engines and rendering pipelines.

Supported platforms include:

- Unity
- Unreal Engine
- Godot
- Blender
- Three.js
- Babylon.js

---

# Security

ForgeAI performs runtime validation before rendering AI-generated code.

Current safeguards include:

- Input validation
- Prompt sanitization
- Markdown removal
- Controlled runtime execution
- Client-side rendering only

No executable binaries are generated or downloaded.

---

# Future Enhancements

Planned improvements include:

- User authentication
- Cloud asset synchronization
- AI-generated textures
- Image-to-3D generation
- Multi-object scene composition
- Public asset library
- Version history
- Collaborative workspaces
- Asset sharing
- Plugin support for major game engines

---

# License

This project is released under the MIT License.
