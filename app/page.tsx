'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { v4 as uuidv4 } from 'uuid'

import type { GameStyle } from '@/lib/promptBuilder'
import { safeExecute } from '@/lib/codeRunner'
import { exportAsGLB, exportAllAsZip } from '@/lib/exportHelpers'
import {
  type Asset,
  loadAssets,
  saveAsset,
  deleteAsset,
} from '@/lib/storage'

import StyleSelector from '@/components/StyleSelector'
import PromptPanel from '@/components/PromptPanel'
import LoadingOverlay from '@/components/LoadingOverlay'
import AssetShelf from '@/components/AssetShelf'
import ExportPanel from '@/components/ExportPanel'

// Dynamic import for the R3F canvas — must be client-only
const ForgeCanvas = dynamic(() => import('@/components/ForgeCanvas'), {
  ssr: false,
})

export default function HomePage() {
  // ─── State ────────────────────────────────────────────
  const [selectedStyle, setSelectedStyle] = useState<GameStyle>('medieval')
  const [currentObject, setCurrentObject] = useState<THREE.Object3D | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('')
  const [assets, setAssets] = useState<Asset[]>([])
  const [activeAssetId, setActiveAssetId] = useState<string | undefined>()
  const [lastPrompt, setLastPrompt] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // Load persisted assets on mount
  useEffect(() => {
    setAssets(loadAssets())
  }, [])

  // ─── Generate flow ────────────────────────────────────
  const handleGenerate = useCallback(
    async (prompt: string) => {
      setIsLoading(true)
      setError(null)
      setEnhancedPrompt('')
      setLastPrompt(prompt)

      try {
        // 1. Call our API route
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, style: selectedStyle }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || `Server error (${res.status})`)
        }

        // 2. Execute the code
        const result = safeExecute(data.code)

        if (result.error) {
          throw new Error(result.error)
        }

        // 3. Render the object
        setCurrentObject(result.object)
        setEnhancedPrompt(data.enhancedPrompt || prompt)

        // 4. Save to shelf
        const assetName =
          result.object!.name !== 'ForgeAI_Asset'
            ? result.object!.name
            : prompt.slice(0, 30)

        const newAsset: Asset = {
          id: uuidv4(),
          name: assetName,
          prompt,
          enhancedPrompt: data.enhancedPrompt || prompt,
          style: selectedStyle,
          code: data.code,
          createdAt: Date.now(),
        }

        const updated = saveAsset(newAsset)
        setAssets(updated)
        setActiveAssetId(newAsset.id)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [selectedStyle]
  )

  // ─── Asset shelf actions ──────────────────────────────
  const handleSelectAsset = useCallback((asset: Asset) => {
    const result = safeExecute(asset.code)
    if (result.object) {
      setCurrentObject(result.object)
      setEnhancedPrompt(asset.enhancedPrompt)
      setActiveAssetId(asset.id)
      setError(null)
    }
  }, [])

  const handleDeleteAsset = useCallback(
    (id: string) => {
      const updated = deleteAsset(id)
      setAssets(updated)
      if (activeAssetId === id) {
        setCurrentObject(null)
        setActiveAssetId(undefined)
        setEnhancedPrompt('')
      }
    },
    [activeAssetId]
  )

  const handleExportAll = useCallback(async () => {
    if (assets.length === 0) return

    const items = assets
      .map((asset) => {
        const result = safeExecute(asset.code)
        if (result.object) {
          return { object: result.object, name: asset.name }
        }
        return null
      })
      .filter(Boolean) as { object: THREE.Object3D; name: string }[]

    try {
      await exportAllAsZip(items)
    } catch (err) {
      console.error('[ForgeAI] Export all failed:', err)
    }
  }, [assets])

  // ─── GLB export ───────────────────────────────────────
  const handleExportGLB = useCallback(async () => {
    if (!currentObject) return
    setIsExporting(true)
    try {
      await exportAsGLB(currentObject)
    } catch (err) {
      console.error('[ForgeAI] GLB export failed:', err)
    } finally {
      setIsExporting(false)
    }
  }, [currentObject])

  // ─── Retry ────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    if (lastPrompt) {
      handleGenerate(lastPrompt)
    }
  }, [lastPrompt, handleGenerate])

  // ─── Render ───────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-forge-border/40 px-6 py-3 glass">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forge-accent to-forge-cyan shadow-lg shadow-forge-accent/20">
            <span className="text-lg">⚒️</span>
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold tracking-tight">
              Forge<span className="text-forge-accent">AI</span>
            </h1>
            <p className="text-[10px] text-forge-text-secondary/60 -mt-0.5">
              AI-Powered 3D Asset Generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-forge-border/30 bg-forge-surface/30 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-forge-success animate-pulse" />
            <span className="text-[10px] text-forge-text-secondary">Online</span>
          </div>
        </div>
      </header>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <aside className="w-80 flex-shrink-0 overflow-y-auto border-r border-forge-border/40 bg-forge-surface/20 p-5 space-y-6">
          <StyleSelector
            selected={selectedStyle}
            onChange={setSelectedStyle}
          />

          <div className="h-px bg-forge-border/30" />

          <PromptPanel
            onSubmit={handleGenerate}
            isLoading={isLoading}
            enhancedPrompt={enhancedPrompt}
          />

          <div className="h-px bg-forge-border/30" />

          <ExportPanel
            object={currentObject}
            prompt={enhancedPrompt || lastPrompt}
            onExportGLB={handleExportGLB}
            isExporting={isExporting}
          />
        </aside>

        {/* Canvas area */}
        <main className="relative flex-1 p-3">
          <div className="relative h-full canvas-glow rounded-2xl">
            <ForgeCanvas object={currentObject} isLoading={isLoading} />
            <LoadingOverlay
              isVisible={isLoading}
              error={error}
              onRetry={handleRetry}
            />
          </div>
        </main>
      </div>

      {/* ── Bottom shelf ── */}
      <div className="h-[120px] flex-shrink-0 border-t border-forge-border/40 bg-forge-surface/20">
        <AssetShelf
          assets={assets}
          activeId={activeAssetId}
          onSelect={handleSelectAsset}
          onDelete={handleDeleteAsset}
          onExportAll={handleExportAll}
        />
      </div>
    </div>
  )
}
