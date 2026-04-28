'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Rotating wrapper to gently spin the model ─── */
function AutoRotate({
  children,
  enabled,
}: {
  children: React.ReactNode
  enabled: boolean
}) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    if (enabled && ref.current) {
      ref.current.rotation.y += delta * 0.3
    }
  })
  return <group ref={ref}>{children}</group>
}

/* ─── Dynamic generated model component ─── */
function GeneratedModel({ object }: { object: THREE.Object3D }) {
  const cloned = useMemo(() => object.clone(), [object])
  return <primitive object={cloned} />
}

/* ─── Placeholder cube that floats when idle ─── */
function PlaceholderCube() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      ref.current.rotation.y = state.clock.elapsedTime * 0.4
      ref.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.15 + 0.5
    }
  })
  return (
    <mesh ref={ref} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.25}
      />
    </mesh>
  )
}

/* ─── Main Canvas Component ─── */
interface ForgeCanvasProps {
  object: THREE.Object3D | null
  isLoading: boolean
}

type BgMode = 'dark' | 'gradient' | 'studio'

export default function ForgeCanvas({ object, isLoading }: ForgeCanvasProps) {
  const [wireframe, setWireframe] = useState(false)
  const [bgMode, setBgMode] = useState<BgMode>('dark')
  const [autoRotate, setAutoRotate] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Apply wireframe toggle to all meshes in the object
  useEffect(() => {
    if (!object) return
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material]
        mats.forEach((mat) => {
          if ('wireframe' in mat) {
            ;(mat as THREE.MeshStandardMaterial).wireframe = wireframe
          }
        })
      }
    })
  }, [object, wireframe])

  const handleScreenshot = () => {
    if (!canvasRef.current) return
    const dataUrl = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'ForgeAI_screenshot.png'
    a.click()
  }

  const bgColor =
    bgMode === 'dark'
      ? '#08080f'
      : bgMode === 'gradient'
        ? '#0c0c1a'
        : '#1a1a2e'

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-forge-border/50">
      {/* Canvas toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          id="toggle-wireframe"
          onClick={() => setWireframe((w) => !w)}
          title="Toggle wireframe"
          className={`rounded-lg p-2 text-xs transition-all border ${
            wireframe
              ? 'border-forge-accent bg-forge-accent/15 text-forge-accent'
              : 'border-forge-border/60 bg-forge-surface/60 text-forge-text-secondary hover:text-forge-text-primary'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </button>

        <button
          id="toggle-auto-rotate"
          onClick={() => setAutoRotate((r) => !r)}
          title="Toggle auto-rotate"
          className={`rounded-lg p-2 text-xs transition-all border ${
            autoRotate
              ? 'border-forge-accent bg-forge-accent/15 text-forge-accent'
              : 'border-forge-border/60 bg-forge-surface/60 text-forge-text-secondary hover:text-forge-text-primary'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>

        {/* Background switcher */}
        <div className="flex rounded-lg border border-forge-border/60 overflow-hidden">
          {(['dark', 'gradient', 'studio'] as BgMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setBgMode(mode)}
              className={`px-2 py-2 text-[10px] uppercase tracking-wide transition-colors ${
                bgMode === mode
                  ? 'bg-forge-accent/15 text-forge-accent font-medium'
                  : 'bg-forge-surface/40 text-forge-text-secondary hover:text-forge-text-primary'
              }`}
            >
              {mode === 'dark' ? '🌑' : mode === 'gradient' ? '🌌' : '💡'}
            </button>
          ))}
        </div>

        <button
          id="screenshot-btn"
          onClick={handleScreenshot}
          title="Save screenshot"
          className="rounded-lg p-2 text-xs border border-forge-border/60 bg-forge-surface/60
                     text-forge-text-secondary hover:text-forge-text-primary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-forge-bg/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-forge-accent/30 border-t-forge-accent animate-spin" />
            <span className="text-sm text-forge-text-secondary font-heading">
              Generating…
            </span>
          </div>
        </div>
      )}

      {/* Placeholder text */}
      {!object && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-2 opacity-40">
            <p className="text-3xl">🔮</p>
            <p className="text-sm font-heading text-forge-text-secondary">
              Describe an asset to forge it
            </p>
          </div>
        </div>
      )}

      {/* R3F Canvas */}
      <Canvas
        ref={canvasRef}
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [3, 3, 5], fov: 45 }}
        style={{ background: bgColor }}
      >
        {/* Lighting rig */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 4, -5]} intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.3} color="#6366f1" />

        {bgMode === 'studio' && <Environment preset="studio" />}

        {/* Grid floor */}
        <Grid
          position={[0, -0.01, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e1e3a"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#2a2a4a"
          fadeDistance={15}
          fadeStrength={1}
          infiniteGrid
        />

        {/* Ground plane for shadows */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>

        {/* Content */}
        <AutoRotate enabled={autoRotate && !isLoading}>
          {object ? <GeneratedModel object={object} /> : <PlaceholderCube />}
        </AutoRotate>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={1}
          maxDistance={20}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  )
}
