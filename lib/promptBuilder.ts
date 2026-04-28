export type GameStyle =
  | 'medieval'
  | 'cyberpunk'
  | 'cartoon'
  | 'pbr'
  | 'voxel'
  | 'scifi'

interface StyleConfig {
  label: string
  keywords: string[]
  colorPalette: string
  geometryHints: string
}

const STYLE_CONFIGS: Record<GameStyle, StyleConfig> = {
  medieval: {
    label: 'Medieval Fantasy',
    keywords: [
      'hand-painted textures',
      'worn stone',
      'ornate metalwork',
      'weathered wood',
      'fantasy proportions',
    ],
    colorPalette:
      'earthy browns, aged golds, deep forest greens, stone grays',
    geometryHints:
      'Use rounded/organic shapes. Add decorative bevels and chamfers. Include subtle asymmetry for a hand-crafted feel.',
  },
  cyberpunk: {
    label: 'Cyberpunk',
    keywords: [
      'neon-lit surfaces',
      'holographic panels',
      'chrome and glass',
      'circuit-board patterns',
      'glowing edges',
    ],
    colorPalette:
      'electric cyan, hot magenta, deep purple, neon green accents on dark backgrounds',
    geometryHints:
      'Use sharp angles and hard edges. Add thin extruded panel lines. Include small emissive geometry for glow effects.',
  },
  cartoon: {
    label: 'Cartoon / Stylized',
    keywords: [
      'bold outlines',
      'exaggerated proportions',
      'bright saturated colors',
      'smooth rounded shapes',
      'playful squash-and-stretch',
    ],
    colorPalette:
      'bright primary colors, pastel accents, clean whites, warm shadows',
    geometryHints:
      'Use oversized features. Keep geometry smooth with low poly counts. Avoid sharp edges — use rounded corners everywhere.',
  },
  pbr: {
    label: 'Realistic PBR',
    keywords: [
      'physically accurate materials',
      'detailed surface imperfections',
      'correct scale reference',
      'realistic proportions',
      'subtle ambient occlusion',
    ],
    colorPalette:
      'natural material colors, subtle variation, realistic metal and wood tones',
    geometryHints:
      'Use real-world proportions. Add micro-detail geometry (screws, seams, ridges). Keep topology clean for subdivision.',
  },
  voxel: {
    label: 'Voxel',
    keywords: [
      'blocky cube-based geometry',
      'pixel-art inspired colors',
      'stepped surfaces',
      'Minecraft-style construction',
      'grid-aligned shapes',
    ],
    colorPalette:
      'flat saturated colors, limited palette of 8-16 colors, no gradients',
    geometryHints:
      'Build ONLY with BoxGeometry. Align everything to a grid. No curved surfaces — only right angles. Use 0.5-unit or 1-unit cubes.',
  },
  scifi: {
    label: 'Sci-Fi',
    keywords: [
      'sleek futuristic surfaces',
      'glowing energy cores',
      'modular panel construction',
      'aerospace-inspired shapes',
      'force-field effects',
    ],
    colorPalette:
      'cool blues, silver metallics, white with orange/cyan accents, dark hull plating',
    geometryHints:
      'Use smooth, aerodynamic forms. Add technical greebles and panel lines. Include transparent or emissive elements for energy effects.',
  },
}

/**
 * Builds a style-specific prompt segment that gets injected into the Claude
 * system prompt so the generated Three.js code matches the selected art style.
 */
export function buildStylePrompt(style: GameStyle): string {
  const cfg = STYLE_CONFIGS[style]
  return [
    `Art Style: ${cfg.label}`,
    `Visual Keywords: ${cfg.keywords.join(', ')}`,
    `Color Palette: ${cfg.colorPalette}`,
    `Geometry Guidelines: ${cfg.geometryHints}`,
  ].join('\n')
}

/**
 * Wraps the user's raw prompt with style context to produce the final prompt
 * that is sent to Claude.
 */
export function enhancePrompt(
  userPrompt: string,
  style: GameStyle
): string {
  const styleBlock = buildStylePrompt(style)
  return `Create a 3D game asset based on this description:\n"${userPrompt.trim()}"\n\n${styleBlock}`
}

/**
 * Returns the full list of available styles with labels and accent colors
 * for the StyleSelector UI component.
 */
export function getStyleOptions(): {
  id: GameStyle
  label: string
  accent: string
}[] {
  return [
    { id: 'medieval', label: 'Medieval Fantasy', accent: '#8b5cf6' },
    { id: 'cyberpunk', label: 'Cyberpunk', accent: '#22d3ee' },
    { id: 'cartoon', label: 'Cartoon / Stylized', accent: '#f472b6' },
    { id: 'pbr', label: 'Realistic PBR', accent: '#10b981' },
    { id: 'voxel', label: 'Voxel', accent: '#f59e0b' },
    { id: 'scifi', label: 'Sci-Fi', accent: '#6366f1' },
  ]
}
