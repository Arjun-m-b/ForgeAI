'use client'

import { type GameStyle, getStyleOptions } from '@/lib/promptBuilder'

interface StyleSelectorProps {
  selected: GameStyle
  onChange: (style: GameStyle) => void
}

const STYLE_ICONS: Record<GameStyle, string> = {
  medieval: '⚔️',
  cyberpunk: '🌃',
  cartoon: '🎨',
  pbr: '💎',
  voxel: '🧊',
  scifi: '🚀',
}

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  const styles = getStyleOptions()

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-widest text-forge-text-secondary font-heading">
        Art Style
      </label>
      <div className="grid grid-cols-3 gap-2">
        {styles.map((s) => {
          const isActive = s.id === selected
          return (
            <button
              key={s.id}
              id={`style-${s.id}`}
              onClick={() => onChange(s.id)}
              className={`
                relative group flex flex-col items-center gap-1 rounded-xl px-2 py-3
                border transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? 'border-opacity-60 bg-opacity-10 scale-[1.03]'
                    : 'border-forge-border bg-forge-surface/40 hover:bg-forge-surface/80 hover:border-forge-border/80'
                }
              `}
              style={
                isActive
                  ? {
                      borderColor: s.accent,
                      backgroundColor: `${s.accent}15`,
                      boxShadow: `0 0 20px ${s.accent}20`,
                    }
                  : undefined
              }
            >
              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: s.accent }}
                />
              )}

              <span className="text-xl leading-none">{STYLE_ICONS[s.id]}</span>
              <span
                className={`text-[11px] font-medium leading-tight text-center transition-colors ${
                  isActive ? 'text-forge-text-primary' : 'text-forge-text-secondary'
                }`}
                style={isActive ? { color: s.accent } : undefined}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
