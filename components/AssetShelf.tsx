'use client'

import { useRef } from 'react'
import type { Asset } from '@/lib/storage'

interface AssetShelfProps {
  assets: Asset[]
  activeId?: string
  onSelect: (asset: Asset) => void
  onDelete: (id: string) => void
  onExportAll: () => void
}

export default function AssetShelf({
  assets,
  activeId,
  onSelect,
  onDelete,
  onExportAll,
}: AssetShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <p className="text-xs text-forge-text-secondary/40 font-heading">
          Generated assets will appear here
        </p>
      </div>
    )
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex items-center gap-3 h-full px-3">
      {/* Label */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-widest text-forge-text-secondary/50 font-heading">
          Shelf
        </span>
        <span className="text-[10px] text-forge-text-secondary/30">
          {assets.length}/20
        </span>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto flex-1 py-1 scrollbar-thin"
      >
        {assets.map((asset) => {
          const isActive = asset.id === activeId
          return (
            <button
              key={asset.id}
              onClick={() => onSelect(asset)}
              className={`
                group relative flex-shrink-0 w-[140px] h-[90px] rounded-xl
                border overflow-hidden transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? 'border-forge-accent/60 bg-forge-accent/5 ring-1 ring-forge-accent/20'
                    : 'border-forge-border/40 bg-forge-surface/30 hover:border-forge-border hover:bg-forge-surface/60'
                }
              `}
            >
              {/* Thumbnail or gradient placeholder */}
              {asset.thumbnail ? (
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)`,
                  }}
                />
              )}

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-forge-bg/90 via-transparent to-transparent">
                <p className="text-[11px] font-medium text-forge-text-primary truncate">
                  {asset.name}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] text-forge-text-secondary/60 capitalize">
                    {asset.style}
                  </span>
                  <span className="text-[9px] text-forge-text-secondary/40">
                    {formatTime(asset.createdAt)}
                  </span>
                </div>
              </div>

              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(asset.id)
                }}
                className="absolute top-1.5 right-1.5 h-5 w-5 rounded-md
                           bg-forge-error/80 text-white text-[10px]
                           flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity
                           hover:bg-forge-error"
              >
                ✕
              </button>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-forge-accent animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* Export All button */}
      {assets.length > 1 && (
        <button
          id="export-all-btn"
          onClick={onExportAll}
          className="flex-shrink-0 rounded-xl border border-forge-border/40 bg-forge-surface/30
                     px-3 py-2 text-[10px] uppercase tracking-wider font-heading font-medium
                     text-forge-text-secondary hover:text-forge-text-primary
                     hover:bg-forge-surface/60 hover:border-forge-accent/30
                     transition-all"
        >
          Export All
          <br />
          <span className="text-forge-accent">ZIP</span>
        </button>
      )}
    </div>
  )
}
