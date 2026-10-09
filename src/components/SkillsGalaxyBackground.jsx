import React, { useEffect, useRef } from 'react'

/**
 * SkillsGalaxyBackground
 * Procedural Dynamic Spiral Galaxy Vortex Engine.
 * Simulates real galactic differential rotation and density wave spiral physics:
 * - Electric Blue / Cyan spiral arm
 * - Hot Magenta / Pink spiral arm
 * - Deep Cosmic Violet & Purple interstellar dust clouds
 * - Differential rotation (inner core orbits faster than outer arms)
 * - Orbiting starlight + JWST 4-point diffraction spike stars
 * - Central cosmic vortex eye
 * - 100% Canvas procedural physics — No static background images!
 */
const SkillsGalaxyBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let width = 0
    let height = 0
    let centerX = 0
    let centerY = 0
    let maxRadius = 0

    // Offscreen canvas caches for pre-rendered particle glow puffs (for maximum 60/120fps performance)
    const createGlowTexture = (colorStop0, colorStop1, size) => {
      const offCanvas = document.createElement('canvas')
      offCanvas.width = size
      offCanvas.height = size
      const offCtx = offCanvas.getContext('2d')
      const half = size / 2
      const grad = offCtx.createRadialGradient(half, half, 0, half, half, half)
      grad.addColorStop(0, colorStop0)
      grad.addColorStop(0.5, colorStop1)
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      offCtx.fillStyle = grad
      offCtx.fillRect(0, 0, size, size)
      return offCanvas
    }

    // Pre-cache nebula puffs in Cyan/Blue, Magenta/Pink, and Violet/Purple
    const cyanPuff = createGlowTexture('rgba(0, 244, 255, 0.45)', 'rgba(2, 132, 199, 0.15)', 96)
    const pinkPuff = createGlowTexture('rgba(255, 42, 133, 0.45)', 'rgba(219, 39, 119, 0.15)', 96)
    const violetPuff = createGlowTexture('rgba(139, 92, 246, 0.40)', 'rgba(76, 29, 149, 0.12)', 112)
    const corePuff = createGlowTexture('rgba(255, 255, 255, 0.8)', 'rgba(192, 132, 252, 0.25)', 80)

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      width = rect?.width || window.innerWidth
      height = rect?.height || window.innerHeight
      centerX = width / 2
      centerY = height / 2
      maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 0.95

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()

    // Smooth interactive cursor tilt / gravitational pull
    const mouse = {
      x: centerX,
      y: centerY,
      targetX: centerX,
      targetY: centerY,
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.targetX = centerX
      mouse.targetY = centerY
    }

    let resizeTimer = null
    const handleResize = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer)
      resizeTimer = requestAnimationFrame(resize)
    }

    window.addEventListener('resize', handleResize)
    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove)
      parent.addEventListener('mouseleave', handleMouseLeave)
    }

    // Procedural Galaxy Simulation Model
    const isMobile = width < 768
    const gasCloudCount = isMobile ? 140 : 260
    const starCount = isMobile ? 180 : 360
    const spikeStarCount = isMobile ? 8 : 16

    // Spiral physics parameters
    const arms = 2 // 2 primary spiral arms (Cyan & Pink)
    const spiralWinding = 3.6 // logarithmic spiral curvature
    const baseRotationSpeed = 0.0018 // slow, majestic vortex speed

    // 1. Gas Dust Clouds (Soft, billowing volumetric nebula puffs)
    class NebulaGasParticle {
      constructor() {
        this.reset(true)
      }

      reset(initial = false) {
        // Distance distribution (concentrated mid-arms with core falloff)
        const u = Math.random()
        this.radius = 35 + Math.pow(u, 1.4) * (maxRadius * 0.82)
        this.arm = Math.floor(Math.random() * arms)
        // Logarithmic spiral angle + dispersion jitter
        const armAngle = (this.arm * (2 * Math.PI)) / arms
        const spiralAngle = Math.log(this.radius / 30) * spiralWinding
        const jitter = (Math.random() - 0.5) * 0.75 // width of spiral arm gas
        this.angle = armAngle + spiralAngle + jitter

        // In real galactic rotation, v(r) = constant or Keplerian: angular velocity omega = v / r
        this.orbitalSpeed = (baseRotationSpeed * 95) / (this.radius + 40)

        // Select pre-rendered texture according to spiral arm & radius
        if (this.arm === 0) {
          // Electric Blue / Cyan arm
          this.texture = Math.random() > 0.3 ? cyanPuff : violetPuff
        } else {
          // Hot Magenta / Pink arm
          this.texture = Math.random() > 0.3 ? pinkPuff : violetPuff
        }

        this.scale = 0.6 + Math.random() * 0.9 + (this.radius / maxRadius) * 0.8
        this.baseAlpha = 0.18 + Math.random() * 0.22
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.015 + Math.random() * 0.02
      }

      update() {
        this.angle += this.orbitalSpeed
        this.pulsePhase += this.pulseSpeed
      }

      draw(offsetX, offsetY) {
        const x = centerX + Math.cos(this.angle) * this.radius + offsetX * 0.3
        const y = centerY + Math.sin(this.angle) * this.radius * 0.78 + offsetY * 0.3
        const size = 96 * this.scale
        const alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.06

        ctx.globalAlpha = Math.max(0.04, Math.min(0.55, alpha))
        ctx.drawImage(this.texture, x - size / 2, y - size / 2, size, size)
      }
    }

    // 2. Swirling Starlight Particles (Pin-sharp stellar dust)
    class OrbitingStar {
      constructor(isSpike = false) {
        this.isSpike = isSpike
        this.reset(true)
      }

      reset(initial = false) {
        const u = Math.random()
        this.radius = 20 + Math.pow(u, 1.2) * (maxRadius * 0.88)
        this.arm = Math.floor(Math.random() * arms)
        const armAngle = (this.arm * (2 * Math.PI)) / arms
        const spiralAngle = Math.log(this.radius / 25) * spiralWinding
        const jitter = (Math.random() - 0.5) * 0.9
        this.angle = armAngle + spiralAngle + jitter
        this.orbitalSpeed = (baseRotationSpeed * 105) / (this.radius + 35)

        this.size = this.isSpike ? 2.0 + Math.random() * 1.5 : 0.6 + Math.random() * 1.4
        // Star color palette
        const colors = this.arm === 0
          ? ['#ffffff', '#00f4ff', '#7dd3fc', '#c084fc']
          : ['#ffffff', '#ff80bf', '#f472b6', '#c084fc']
        this.color = colors[Math.floor(Math.random() * colors.length)]

        this.twinklePhase = Math.random() * Math.PI * 2
        this.twinkleSpeed = 0.02 + Math.random() * 0.03
        this.spikeLength = this.isSpike ? 14 + Math.random() * 12 : 0
      }

      update() {
        this.angle += this.orbitalSpeed
        this.twinklePhase += this.twinkleSpeed
      }

      draw(offsetX, offsetY) {
        const x = centerX + Math.cos(this.angle) * this.radius + offsetX * 0.4
        const y = centerY + Math.sin(this.angle) * this.radius * 0.78 + offsetY * 0.4
        const brightness = 0.45 + Math.sin(this.twinklePhase) * 0.45

        ctx.globalAlpha = Math.max(0.1, Math.min(1, brightness))

        if (this.isSpike) {
          // Space Telescope 4-Point Diffraction Cross Spikes (Selected bright stars)
          const sLen = this.spikeLength * (0.8 + Math.sin(this.twinklePhase) * 0.25)
          ctx.strokeStyle = this.color
          ctx.lineWidth = 0.9

          ctx.beginPath()
          // Horizontal cross spike
          ctx.moveTo(x - sLen, y)
          ctx.lineTo(x + sLen, y)
          // Vertical cross spike
          ctx.moveTo(x, y - sLen)
          ctx.lineTo(x, y + sLen)
          ctx.stroke()

          // Stellar Core
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(x, y, this.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // High-Performance Stellar Particle (Crisp & Zero shadowBlur Lag)
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(x, y, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Initialize particle arrays
    const gasParticles = Array.from({ length: gasCloudCount }, () => new NebulaGasParticle())
    const stars = [
      ...Array.from({ length: starCount }, () => new OrbitingStar(false)),
      ...Array.from({ length: spikeStarCount }, () => new OrbitingStar(true)),
    ]

    // Central Vortex Core Glow & Singularity
    let corePulse = 0

    // Master Animation Frame Loop
    const render = () => {
      // Smooth interactive mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05
      const offsetX = (mouse.x - centerX) * 0.08
      const offsetY = (mouse.y - centerY) * 0.08

      corePulse += 0.02

      ctx.clearRect(0, 0, width, height)

      // 1. Draw Volumetric Nebula Gas Particles (Soft additive glow)
      ctx.globalCompositeOperation = 'screen'
      gasParticles.forEach((gas) => {
        gas.update()
        gas.draw(offsetX, offsetY)
      })

      // 2. Central Galactic Singularity / Accretion Photon Glow
      const coreSize = 90 + Math.sin(corePulse) * 8
      ctx.drawImage(
        corePuff,
        centerX + offsetX * 0.2 - coreSize / 2,
        centerY + offsetY * 0.2 - (coreSize * 0.78) / 2,
        coreSize,
        coreSize * 0.78
      )

      // 3. Draw Orbiting Starlight & Diffraction Spikes
      ctx.globalCompositeOperation = 'source-over'
      stars.forEach((star) => {
        star.update()
        star.draw(offsetX, offsetY)
      })

      // 4. Central Black Hole Singularity Eye (The deep vortex hole at the galaxy center)
      const eyeX = centerX + offsetX * 0.2
      const eyeY = centerY + offsetY * 0.2
      const eyeRadius = 14 + Math.sin(corePulse * 0.8) * 2

      ctx.save()
      // Black singularity core
      ctx.fillStyle = '#010006'
      ctx.beginPath()
      ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2)
      ctx.fill()

      // Luminous cyan-pink event horizon edge ring
      ctx.strokeStyle = 'rgba(0, 244, 255, 0.45)'
      ctx.lineWidth = 1.2
      ctx.shadowColor = '#ff2a85'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    // Auto-pause when browser tab is inactive (Battery & GPU preservation)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId)
      } else {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      if (resizeTimer) cancelAnimationFrame(resizeTimer)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove)
        parent.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Deep Interstellar Obsidian Void */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* 2. Ambient Deep Space Plasma Nebulae (Deep chromatic background undercurrent) */}
      <div
        className="absolute top-1/4 -right-10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-30 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #ec4899 0%, #be185d 40%, transparent 75%)',
          animationDuration: '10s',
        }}
      />
      <div
        className="absolute bottom-1/4 -left-10 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-30 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #00f4ff 0%, #0369a1 40%, transparent 75%)',
          animationDuration: '12s',
        }}
      />
      <div
        className="absolute -top-10 left-1/3 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-25 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, #4c1d95 40%, transparent 75%)',
          animationDuration: '14s',
        }}
      />

      {/* 3. Pure Procedural Moving Spiral Galaxy Canvas (60 FPS Vortex Physics) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 4. Optical Telescope Barrel Aperture & Central Card Contrast Shield */}
      {/* Soft radial vignette keeps central text 100% readable while the vortex arms swirl vividly around */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.58) 0%, rgba(2, 1, 10, 0.42) 48%, rgba(0, 0, 0, 0.88) 85%, rgba(0, 0, 0, 0.98) 100%)',
        }}
      />

      {/* 5. Subtle Astronomical Observatory Reticle Markings */}
      <div className="absolute top-6 left-6 text-[10px] font-mono tracking-widest text-cyan-400/25 uppercase hidden sm:block">
        [ SPIRAL GALAXY VORTEX // OBS-V2 ]
      </div>
      <div className="absolute top-6 right-6 text-[10px] font-mono tracking-widest text-pink-400/25 uppercase hidden sm:block">
        [ ARMS: CYAN-PINK // DENSITY WAVE ]
      </div>
      <div className="absolute bottom-6 right-8 text-[10px] font-mono tracking-widest text-purple-400/25 uppercase hidden sm:block">
        [ DIFF-ROTATION: 60FPS KEPLER ]
      </div>
    </div>
  )
}

export default SkillsGalaxyBackground
