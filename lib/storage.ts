import type { GameStyle } from './promptBuilder'

const STORAGE_KEY = 'forgeai_assets'
const MAX_ASSETS = 20

export interface Asset {
  id: string
  name: string
  prompt: string
  enhancedPrompt: string
  style: GameStyle
  code: string
  createdAt: number // Unix timestamp in ms
  thumbnail?: string // Base64 data URL from canvas snapshot
}

/**
 * Loads all saved assets from localStorage, sorted newest-first.
 */
export function loadAssets(): Asset[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const assets: Asset[] = JSON.parse(raw)
    return assets.sort((a, b) => b.createdAt - a.createdAt)
  } catch {
    console.warn('[ForgeAI] Failed to load assets from localStorage')
    return []
  }
}

/**
 * Saves a new asset to localStorage. If the shelf exceeds MAX_ASSETS,
 * the oldest asset is automatically removed.
 */
export function saveAsset(asset: Asset): Asset[] {
  const assets = loadAssets()

  // Prevent duplicates by id
  const filtered = assets.filter((a) => a.id !== asset.id)

  // Prepend new asset
  filtered.unshift(asset)

  // Enforce limit — trim from the end (oldest)
  while (filtered.length > MAX_ASSETS) {
    filtered.pop()
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (err) {
    console.warn('[ForgeAI] localStorage write failed:', err)
  }

  return filtered
}

/**
 * Deletes a single asset by id.
 */
export function deleteAsset(id: string): Asset[] {
  const assets = loadAssets().filter((a) => a.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
  } catch {
    console.warn('[ForgeAI] Failed to delete asset from localStorage')
  }
  return assets
}

/**
 * Removes all saved assets.
 */
export function clearAssets(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    console.warn('[ForgeAI] Failed to clear localStorage')
  }
}

/**
 * Updates a specific field on an existing asset.
 */
export function updateAsset(
  id: string,
  updates: Partial<Omit<Asset, 'id'>>
): Asset[] {
  const assets = loadAssets().map((a) =>
    a.id === id ? { ...a, ...updates } : a
  )
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
  } catch {
    console.warn('[ForgeAI] Failed to update asset in localStorage')
  }
  return assets
}
