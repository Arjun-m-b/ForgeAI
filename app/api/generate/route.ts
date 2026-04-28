import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { type GameStyle, buildStylePrompt } from '@/lib/promptBuilder'

const SYSTEM_PROMPT = `You are an expert Three.js programmer specializing in procedural 3D game asset creation.

CRITICAL RULES:
1. Output ONLY valid JavaScript code — no markdown, no explanations, no backticks.
2. Use ONLY the \`THREE\` global object (it is provided to your code). Do NOT import or require anything.
3. Your code MUST return a \`THREE.Group\` containing the complete 3D model.
4. Use \`THREE.MeshStandardMaterial\` for all materials (supports PBR lighting).
5. Set reasonable colors using hex values. Never use textures or image loading.
6. The returned group should be centered at the origin (0, 0, 0).
7. Keep the model between 1–5 units in total size so it fits well in a viewer.
8. Add \`castShadow = true\` and \`receiveShadow = true\` on meshes where appropriate.
9. Use a variety of geometries (Box, Sphere, Cylinder, Cone, Torus, Lathe, Extrude, etc.) to build detailed assets.
10. Give the root group a descriptive \`.name\` property (e.g., \`"medieval_sword"\`).

EXAMPLE OUTPUT FORMAT:
const group = new THREE.Group();
group.name = "example_asset";

const bodyGeo = new THREE.BoxGeometry(1, 2, 1);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.castShadow = true;
group.add(body);

return group;`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style } = body as { prompt: string; style: GameStyle }

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    // Build the style-aware user message
    const styleBlock = style ? buildStylePrompt(style) : ''
    const userMessage = [
      `Create a 3D game asset based on this description:`,
      `"${prompt.trim()}"`,
      '',
      styleBlock,
      '',
      'Remember: return ONLY executable JavaScript code that uses the THREE global and returns a THREE.Group.',
    ]
      .filter(Boolean)
      .join('\n')

    // Enhanced prompt to show the user what was sent
    const enhancedPrompt = `${prompt.trim()}${style ? ` • Style: ${style}` : ''}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    // Extract the text content from the response
    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'Claude returned an empty response.' },
        { status: 500 }
      )
    }

    const code = textBlock.text.trim()

    return NextResponse.json({ code, enhancedPrompt })
  } catch (err: unknown) {
    console.error('[ForgeAI] API error:', err)

    const message =
      err instanceof Error ? err.message : 'Unknown server error'

    // Check for rate limiting
    if (message.includes('rate') || message.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limited — please wait a moment and try again.' },
        { status: 429 }
      )
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
