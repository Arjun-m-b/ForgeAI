'use client'

import * as THREE from 'three'
import { estimateSize } from '@/lib/exportHelpers'

interface ExportPanelProps {
  object: THREE.Object3D | null
  prompt: string
  onExportGLB: () => void
  isExporting?: boolean
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ExportPanel({
  object,
  prompt,
  onExportGLB,
  isExporting,
}: ExportPanelProps) {
  const disabled = !object
  const sizeEstimate = object ? estimateSize(object) : 0

  const handleCopyPrompt = async () => {
    if (!prompt) return
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = prompt
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium uppercase tracking-widest text-forge-text-secondary font-heading">
        Export
      </label>

      {/* GLB Export */}
      <button
        id="export-glb-btn"
        onClick={onExportGLB}
        disabled={disabled || isExporting}
        className="w-full rounded-xl py-2.5 px-4 text-sm font-heading font-medium
                   border border-forge-cyan/30 bg-forge-cyan/5
                   text-forge-cyan hover:bg-forge-cyan/10
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <span className="animate-spin text-xs">⏳</span>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        )}
        Download .GLB
      </button>

      {/* Size estimate */}
      {!disabled && (
        <p className="text-[10px] text-forge-text-secondary/50 text-center">
          Est. size: {formatBytes(sizeEstimate)}
        </p>
      )}

      {/* Engine presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider text-forge-text-secondary/50 font-medium">
          Optimized for
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { name: 'Unity', icon: '🎮' },
            { name: 'Godot', icon: '🤖' },
            { name: 'Blender', icon: '🧊' },
          ].map((engine) => (
            <div
              key={engine.name}
              className={`flex flex-col items-center gap-1 rounded-lg border py-2
                         ${
                           disabled
                             ? 'border-forge-border/20 opacity-30'
                             : 'border-forge-border/40 bg-forge-surface/20'
                         }`}
            >
              <span className="text-sm">{engine.icon}</span>
              <span className="text-[10px] text-forge-text-secondary">
                {engine.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Copy prompt */}
      <button
        onClick={handleCopyPrompt}
        disabled={!prompt}
        className="w-full rounded-lg py-2 text-[11px] font-medium
                   border border-forge-border/30 bg-forge-surface/20
                   text-forge-text-secondary hover:text-forge-text-primary
                   hover:border-forge-accent/30
                   disabled:opacity-20 disabled:cursor-not-allowed
                   transition-all flex items-center justify-center gap-1.5"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        Copy Prompt
      </button>
    </div>
  )
}
