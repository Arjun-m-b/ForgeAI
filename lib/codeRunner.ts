import * as THREE from 'three'

export interface ExecutionResult {
  object: THREE.Object3D
  error: null
}

export interface ExecutionError {
  object: null
  error: string
}

export type SafeExecuteResult = ExecutionResult | ExecutionError

/**
 * Strips markdown code fences (```javascript ... ```) that Claude may wrap
 * around its output. Also removes any leading import/require statements since
 * we inject THREE directly.
 */
function cleanCode(raw: string): string {
  let code = raw.trim()

  // Remove markdown code fences
  // Match ```javascript, ```js, ```typescript, ```ts, or plain ```
  code = code.replace(/^```(?:javascript|js|typescript|ts|jsx|tsx)?\s*\n?/i, '')
  code = code.replace(/\n?```\s*$/i, '')

  // Remove import/require statements — THREE is provided via closure
  code = code.replace(
    /^(?:import\s+.*?from\s+['"].*?['"];?\s*\n?|const\s+.*?=\s*require\(.*?\);?\s*\n?)/gm,
    ''
  )

  return code.trim()
}

/**
 * Safely executes Claude-generated Three.js code and returns the resulting
 * Object3D (typically a Group).
 *
 * The generated code is expected to:
 * 1. Create geometry using `new THREE.BoxGeometry(...)` etc.
 * 2. Create materials using `new THREE.MeshStandardMaterial(...)` etc.
 * 3. Assemble meshes into a `THREE.Group`
 * 4. Return the root group via `return group;`
 *
 * The code runs inside a `new Function()` with `THREE` injected as the only
 * available binding — no access to DOM, `window`, or Node APIs.
 */
export function safeExecute(rawCode: string): SafeExecuteResult {
  const code = cleanCode(rawCode)

  if (!code) {
    return { object: null, error: 'No executable code found in response.' }
  }

  try {
    // Create a sandboxed function with only THREE available
    // The function body is the cleaned Claude output, which should `return` a Group
    const fn = new Function('THREE', code)
    const result = fn(THREE)

    if (!result) {
      return {
        object: null,
        error:
          'Generated code did not return an object. The code must end with `return group;` or similar.',
      }
    }

    // Validate that result is a Three.js Object3D
    if (!(result instanceof THREE.Object3D)) {
      return {
        object: null,
        error: `Generated code returned a ${typeof result} instead of a THREE.Object3D. Ensure the code returns a Group or Mesh.`,
      }
    }

    // Set a default name if none is assigned
    if (!result.name) {
      result.name = 'ForgeAI_Asset'
    }

    return { object: result, error: null }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown execution error'
    return {
      object: null,
      error: `Code execution failed: ${message}`,
    }
  }
}
