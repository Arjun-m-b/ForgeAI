import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import JSZip from 'jszip'

/**
 * Triggers a file download in the browser by creating a temporary anchor.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Exports a single Three.js object as a GLB file (binary glTF).
 * Returns the estimated file size in bytes.
 */
export async function exportAsGLB(
  object: THREE.Object3D,
  filename?: string
): Promise<number> {
  const exporter = new GLTFExporter()

  return new Promise<number>((resolve, reject) => {
    exporter.parse(
      object,
      (result) => {
        // GLB returns ArrayBuffer, glTF returns JSON object
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], {
            type: 'application/octet-stream',
          })
          const name =
            filename ||
            `${object.name || 'ForgeAI_Asset'}.glb`
          downloadBlob(blob, name)
          resolve(result.byteLength)
        } else {
          // Fallback: JSON glTF
          const json = JSON.stringify(result)
          const blob = new Blob([json], { type: 'application/json' })
          const name =
            filename ||
            `${object.name || 'ForgeAI_Asset'}.gltf`
          downloadBlob(blob, name)
          resolve(json.length)
        }
      },
      (error) => {
        reject(new Error(`GLB export failed: ${error}`))
      },
      { binary: true }
    )
  })
}

/**
 * Estimates the rough file size (in bytes) of an Object3D when exported as
 * GLB, without actually running the full export. Useful for showing an
 * estimate in the UI before the user decides to download.
 */
export function estimateSize(object: THREE.Object3D): number {
  let vertices = 0
  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const pos = child.geometry.getAttribute('position')
      if (pos) vertices += pos.count
    }
  })
  // Rough estimate: ~40 bytes per vertex in GLB + 1 KB header overhead
  return vertices * 40 + 1024
}

/**
 * Exports multiple objects into a single ZIP archive, each as its own GLB
 * file. Useful for the "Export All" action in the AssetShelf.
 */
export async function exportAllAsZip(
  items: { object: THREE.Object3D; name: string }[]
): Promise<void> {
  if (items.length === 0) return

  const zip = new JSZip()
  const exporter = new GLTFExporter()

  for (const item of items) {
    const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        item.object,
        (result) => {
          if (result instanceof ArrayBuffer) {
            resolve(result)
          } else {
            const json = JSON.stringify(result)
            const encoder = new TextEncoder()
            resolve(encoder.encode(json).buffer as ArrayBuffer)
          }
        },
        (error) => {
          reject(new Error(`Export failed for ${item.name}: ${error}`))
        },
        { binary: true }
      )
    })

    const safeName = item.name.replace(/[^a-zA-Z0-9_-]/g, '_')
    zip.file(`${safeName}.glb`, buffer)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, 'ForgeAI_Assets.zip')
}
