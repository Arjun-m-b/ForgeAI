'use client'

import { useEffect, useState } from 'react'

interface LoadingOverlayProps {
  isVisible: boolean
  error?: string | null
  onRetry?: () => void
}

const STEPS = [
  { label: 'Analyzing prompt', icon: '🧠' },
  { label: 'Generating Three.js code', icon: '⚡' },
  { label: 'Building geometry', icon: '🔨' },
  { label: 'Rendering asset', icon: '✨' },
]

export default function LoadingOverlay({
  isVisible,
  error,
  onRetry,
}: LoadingOverlayProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // Simulate progress through steps
  useEffect(() => {
    if (!isVisible) {
      setActiveStep(0)
      setProgress(0)
      return
    }

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 2500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        const increment = Math.random() * 8 + 2
        return Math.min(prev + increment, 95)
      })
    }, 400)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [isVisible])

  // Complete progress when loading finishes
  useEffect(() => {
    if (!isVisible && progress > 0) {
      setProgress(100)
      const timeout = setTimeout(() => setProgress(0), 500)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, progress])

  if (!isVisible && !error) return null

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-forge-bg/80 backdrop-blur-md particle-bg" />

      {/* Content */}
      <div className="relative z-10 w-72 space-y-6 text-center">
        {error ? (
          /* Error state */
          <div className="space-y-4 animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forge-error/10 border border-forge-error/20">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-sm font-heading font-semibold text-forge-error">
                Generation Failed
              </h3>
              <p className="mt-1 text-xs text-forge-text-secondary leading-relaxed">
                {error}
              </p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-xl px-6 py-2.5 text-sm font-heading font-medium
                           bg-forge-error/10 border border-forge-error/30
                           text-forge-error hover:bg-forge-error/20
                           transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          /* Loading state */
          <div className="space-y-5 animate-fade-in">
            {/* Spinning forge icon */}
            <div className="mx-auto relative h-16 w-16">
              <div className="absolute inset-0 rounded-2xl bg-forge-accent/10 border border-forge-accent/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-float">🔮</span>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl border border-forge-accent/40 animate-pulse-ring" />
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 transition-all duration-500 ${
                    i === activeStep
                      ? 'bg-forge-accent/10 border border-forge-accent/20'
                      : i < activeStep
                        ? 'opacity-50'
                        : 'opacity-20'
                  }`}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span
                    className={`text-xs font-medium ${
                      i === activeStep
                        ? 'text-forge-accent loading-dots'
                        : 'text-forge-text-secondary'
                    }`}
                  >
                    {step.label}
                  </span>
                  {i < activeStep && (
                    <span className="ml-auto text-forge-success text-xs">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="h-1 w-full rounded-full bg-forge-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forge-accent to-forge-cyan transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-forge-text-secondary/50">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
