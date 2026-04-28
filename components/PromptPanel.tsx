'use client'

import { useState, useCallback, type KeyboardEvent } from 'react'

interface PromptPanelProps {
  onSubmit: (prompt: string) => void
  isLoading: boolean
  enhancedPrompt?: string
}

const EXAMPLE_CHIPS = [
  'Medieval sword with glowing runes',
  'Cyberpunk drone with neon lights',
  'Low-poly cartoon tree',
  'Treasure chest with gold coins',
  'Sci-fi plasma rifle',
  'Voxel castle tower',
  'Crystal potion bottle',
  'Steampunk clockwork gear',
  'Space helmet with visor',
  'Wooden barrel with metal bands',
]

const MAX_CHARS = 500

export default function PromptPanel({
  onSubmit,
  isLoading,
  enhancedPrompt,
}: PromptPanelProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = useCallback(() => {
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim())
    }
  }, [prompt, isLoading, onSubmit])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChipClick = (chip: string) => {
    setPrompt(chip)
  }

  return (
    <div className="space-y-4">
      {/* Prompt input */}
      <div className="space-y-2">
        <label
          htmlFor="prompt-input"
          className="text-xs font-medium uppercase tracking-widest text-forge-text-secondary font-heading"
        >
          Describe Your Asset
        </label>
        <div className="relative">
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value.slice(0, MAX_CHARS))
            }
            onKeyDown={handleKeyDown}
            placeholder="A medieval sword with glowing blue runes along the blade..."
            disabled={isLoading}
            rows={4}
            className="w-full rounded-xl border border-forge-border bg-forge-surface/60 px-4 py-3
                       text-sm text-forge-text-primary placeholder-forge-text-secondary/50
                       resize-none focus-ring transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="absolute bottom-2 right-3 text-[10px] text-forge-text-secondary/50">
            {prompt.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Generate button */}
      <button
        id="generate-btn"
        onClick={handleSubmit}
        disabled={!prompt.trim() || isLoading}
        className="w-full rounded-xl py-3 px-4 font-heading font-semibold text-sm
                   bg-gradient-to-r from-forge-accent to-indigo-500
                   hover:from-forge-accent-hover hover:to-indigo-600
                   text-white shadow-lg shadow-forge-accent/25
                   transition-all duration-200
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                   active:scale-[0.98]
                   flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Forging…
          </>
        ) : (
          <>
            <span className="text-base">⚡</span>
            Generate Asset
          </>
        )}
      </button>

      <p className="text-[10px] text-forge-text-secondary/50 text-center">
        Ctrl + Enter to generate
      </p>

      {/* Enhanced prompt display */}
      {enhancedPrompt && (
        <div className="rounded-lg border border-forge-border/50 bg-forge-surface/30 px-3 py-2 animate-fade-in">
          <span className="text-[10px] uppercase tracking-wider text-forge-accent font-medium">
            Enhanced prompt
          </span>
          <p className="text-xs text-forge-text-secondary mt-1 leading-relaxed">
            {enhancedPrompt}
          </p>
        </div>
      )}

      {/* Example chips */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wider text-forge-text-secondary/60 font-medium">
          Try these
        </span>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              disabled={isLoading}
              className="rounded-full border border-forge-border/60 bg-forge-surface/30
                         px-3 py-1 text-[11px] text-forge-text-secondary
                         hover:border-forge-accent/40 hover:text-forge-text-primary
                         hover:bg-forge-accent/5 transition-all duration-150
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
