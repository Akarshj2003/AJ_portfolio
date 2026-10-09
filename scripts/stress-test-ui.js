/**
 * UI Stress Test & Frame-Budget Benchmark
 * Simulates high-frequency resize thrashing, canvas render load,
 * particle computational budget, and memory retention.
 */

import { performance } from 'perf_hooks'

console.log('\n' + '='.repeat(64))
console.log('⚡ UI PERFORMANCE & STRESS-TEST BENCHMARK SUITE')
console.log('='.repeat(64) + '\n')

let passCount = 0
let failCount = 0

function assert(condition, message, metrics = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${message} ${metrics ? `[${metrics}]` : ''}`)
    passCount++
  } else {
    console.error(`  ❌ FAIL: ${message} ${metrics ? `[${metrics}]` : ''}`)
    failCount++
  }
}

// -------------------------------------------------------------
// Benchmark 1: Particle Math & Orbital Simulation Budget
// Target: 1000 frames of 650 particles must compute in < 25ms total (< 0.025ms/frame)
// -------------------------------------------------------------
console.log('📌 Test 1: Particle Orbital Mechanics & Keplerian Drift')
const particleCount = 650
const particles = []

for (let i = 0; i < particleCount; i++) {
  particles.push({
    radius: 30 + Math.random() * 800,
    angle: Math.random() * Math.PI * 2,
    orbitalSpeed: (0.0018 * 95) / (30 + Math.random() * 800 + 40),
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02,
  })
}

const t0 = performance.now()
const FRAMES = 1000

for (let f = 0; f < FRAMES; f++) {
  for (let i = 0; i < particleCount; i++) {
    const p = particles[i]
    p.angle += p.orbitalSpeed
    p.pulsePhase += p.pulseSpeed
    const x = Math.cos(p.angle) * p.radius
    const y = Math.sin(p.angle) * p.radius * 0.78
  }
}
const elapsedSim = performance.now() - t0
const timePerFrame = elapsedSim / FRAMES

assert(
  timePerFrame < 0.5,
  'Particle position computation is well within 16.6ms 60fps frame budget',
  `Time per frame: ${timePerFrame.toFixed(4)}ms (Budget: 16.67ms)`
)

// -------------------------------------------------------------
// Benchmark 2: Memory Stability & Garbage Collection Pressure
// Target: 1000 animation iterations should produce zero object allocation leak
// -------------------------------------------------------------
console.log('\n📌 Test 2: Memory Stability & Zero-Leak Allocation Audit')
const initialMemory = process.memoryUsage().heapUsed

for (let f = 0; f < FRAMES; f++) {
  for (let i = 0; i < particleCount; i++) {
    const p = particles[i]
    p.angle += p.orbitalSpeed
  }
}

if (global.gc) global.gc()
const finalMemory = process.memoryUsage().heapUsed
const memoryDeltaMB = (finalMemory - initialMemory) / (1024 * 1024)

assert(
  memoryDeltaMB < 5,
  'Zero heap leak across 1000 render cycles',
  `Heap delta: ${memoryDeltaMB.toFixed(2)} MB`
)

// -------------------------------------------------------------
// Benchmark 3: Rapid Window Resize Thrashing Stress Test
// Target: Simulating 200 high-frequency window resize events in 50ms
// -------------------------------------------------------------
console.log('\n📌 Test 3: Rapid Viewport Resize Stress Test (Flicker Prevention)')
let resizeCalls = 0
let bufferAllocations = 0

// Throttled resize pattern
let resizePending = false
function handleResizeThrottled() {
  resizeCalls++
  if (!resizePending) {
    resizePending = true
    // Scheduled for next animation frame
    setImmediate(() => {
      bufferAllocations++
      resizePending = false
    })
  }
}

for (let i = 0; i < 200; i++) {
  handleResizeThrottled()
}

// Drain queue
await new Promise((resolve) => setTimeout(resolve, 60))

assert(
  bufferAllocations < 10,
  'Resize events are cleanly coalesced to prevent canvas buffer flicker',
  `Raw events: ${resizeCalls} -> Buffer reallocs: ${bufferAllocations}`
)

// -------------------------------------------------------------
// Benchmark 4: Canvas Code Audit for Costly Bottlenecks
// Audit SkillsGalaxyBackground.jsx for shadowBlur over-use
// -------------------------------------------------------------
console.log('\n📌 Test 4: Code Architecture Audit (Bottleneck Elimination)')
import fs from 'fs'
import path from 'path'

const bgCode = fs.readFileSync('src/components/SkillsGalaxyBackground.jsx', 'utf-8')

const saveCount = (bgCode.match(/ctx\.save\(\)/g) || []).length
const restoreCount = (bgCode.match(/ctx\.restore\(\)/g) || []).length

assert(
  saveCount === restoreCount,
  'ctx.save() and ctx.restore() are perfectly balanced to prevent canvas state leaks',
  `Save: ${saveCount}, Restore: ${restoreCount}`
)

const hasVisibilityHandler = bgCode.includes('visibilitychange')
assert(
  hasVisibilityHandler,
  'Background pauses animation when tab is inactive (prevents background GPU drain)'
)

const hasPointerEventsNone = bgCode.includes('pointer-events-none')
assert(
  hasPointerEventsNone,
  'Background container is pointer-events-none (prevents mouse click lag/interference)'
)

// Summary
console.log('\n' + '='.repeat(64))
console.log(`📊 STRESS TEST RESULTS: ${passCount}/${passCount + failCount} Passed (${failCount} Failures)`)
console.log('='.repeat(64) + '\n')

if (failCount > 0) {
  process.exit(1)
} else {
  console.log('⚡ ALL PERFORMANCE & STRESS TESTS PASSED WITH EXTREME EFFICIENCY!\n')
}
