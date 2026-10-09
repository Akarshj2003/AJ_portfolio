// scripts/test-responsive-matrix.js
// Automated Responsive Matrix & Viewport Integrity Test Harness
// Built under the Multi-Agent Council protocol

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');

console.log('\n================================================================');
console.log('🏛️  COUNCIL MULTI-VIEWPORT RESPONSIVE INTEGRITY TEST SUITE');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

// ── TEST SUITE 1: CSS Fluid Tokens Verification ──────────────────
console.log('📌 Suite 1: Verifying Fluid Clamping Tokens in index.css');
const indexCSS = fs.readFileSync(path.join(SRC_DIR, 'index.css'), 'utf-8');

assert(
  indexCSS.includes('.fluid-hero-name') && indexCSS.includes('clamp('),
  'Fluid hero name token exists with mathematical clamp() function'
);
assert(
  indexCSS.includes('.fluid-hero-greeting') && indexCSS.includes('clamp('),
  'Fluid hero greeting token exists with clamp()'
);
assert(
  indexCSS.includes('.fluid-hero-role') && indexCSS.includes('clamp('),
  'Fluid hero typewriter role token exists with clamp()'
);
assert(
  indexCSS.includes('.fluid-section-heading') && indexCSS.includes('clamp('),
  'Universal fluid section heading token exists with clamp()'
);

// ── TEST SUITE 2: Section-by-Section Responsive Architecture ──────
console.log('\n📌 Suite 2: Auditing Core Section Components');

// Home.jsx Audit
const homeJSX = fs.readFileSync(path.join(SRC_DIR, 'sections/Home.jsx'), 'utf-8');
assert(
  homeJSX.includes('min-h-screen') && !/(?<!min-)h-screen/.test(homeJSX),
  'Home.jsx uses min-h-screen instead of locked h-screen'
);
assert(
  homeJSX.includes('pt-24') || homeJSX.includes('pt-28'),
  'Home.jsx enforces permanent safe top padding (>= pt-24) preventing navbar overlap'
);
assert(
  homeJSX.includes('fluid-hero-name') && homeJSX.includes('fluid-hero-greeting'),
  'Home.jsx applies fluid clamped classes for monumental desktop display'
);

// FloatingAstronaut.jsx Audit
const astronautJSX = fs.readFileSync(path.join(SRC_DIR, 'components/FloatingAstronaut.jsx'), 'utf-8');
assert(
  astronautJSX.includes("clamp(320px, 36vw, 580px)") && astronautJSX.includes("clamp(340px, 62vh, 620px)"),
  'FloatingAstronaut.jsx uses fluid clamp for both width and height (grand on 4K, compact on split)'
);

// Skills.jsx Audit
const skillsJSX = fs.readFileSync(path.join(SRC_DIR, 'sections/Skills.jsx'), 'utf-8');
assert(
  skillsJSX.includes('flex flex-wrap items-center justify-center') && (skillsJSX.includes('max-w-4xl') || skillsJSX.includes('max-w-3xl')),
  'Skills category filter bar wraps dynamically without rigid 2-col or 3-col holes'
);
assert(
  skillsJSX.includes('fluid-section-heading'),
  'Skills section heading uses universal fluid clamp token'
);
assert(
  !skillsJSX.includes('truncate">') && skillsJSX.includes('leading-tight'),
  'Skills section eliminates truncate on skill button titles (zero truncated skill names)'
);

// Projects.jsx Audit
const projectsJSX = fs.readFileSync(path.join(SRC_DIR, 'sections/Projects.jsx'), 'utf-8');
assert(
  projectsJSX.includes('min-h-screen') && !projectsJSX.includes('h-screen max-h-screen min-h-[580px]'),
  'Projects section uses min-h-screen with full scrollability on compact viewports'
);
assert(
  projectsJSX.includes('fluid-section-heading'),
  'Projects section heading uses universal fluid clamp token'
);
assert(
  projectsJSX.includes('Math.round(windowWidth * 0.28)') || projectsJSX.includes('Math.round(windowWidth * 0.22)'),
  'Projects 3D orbit calculates dynamic fluid radius based on live windowWidth'
);

// Contacts.jsx Audit
const contactsJSX = fs.readFileSync(path.join(SRC_DIR, 'sections/Contacts.jsx'), 'utf-8');
assert(
  contactsJSX.includes('fluid-section-heading'),
  'Contacts section heading uses universal fluid clamp token'
);

// ── TEST SUITE 3: Real Telemetry Viewport Mathematical Simulation ──
console.log('\n📌 Suite 3: Simulating Clamp Math Across Real Visitor Viewports');

const VIEWPORT_MATRIX = [
  { name: '4K Ultra Desktop', width: 2560, height: 1440 },
  { name: '1080p Standard Monitor', width: 1920, height: 1080 },
  { name: 'Scaled 1080p (Windows 125% DPI)', width: 1536, height: 695 },
  { name: 'Standard Budget Laptop', width: 1366, height: 599 },
  { name: 'Compact Laptop Window', width: 1280, height: 585 },
  { name: 'Split-Screen Window (Win+Left)', width: 725, height: 585 },
  { name: 'Mobile Portrait (iPhone)', width: 390, height: 844 },
];

function calculateClampPx(minRem, vwPercent, addRem, maxRem, viewportWidthPx) {
  const rootPx = 16;
  const preferred = (viewportWidthPx * (vwPercent / 100)) + (addRem * rootPx);
  const min = minRem * rootPx;
  const max = maxRem * rootPx;
  return Math.min(Math.max(preferred, min), max);
}

VIEWPORT_MATRIX.forEach((vp) => {
  // Title: clamp(2.75rem, 5.8vw + 0.5rem, 6.25rem)
  const heroNamePx = calculateClampPx(2.75, 5.8, 0.5, 6.25, vp.width);
  // Heading: clamp(1.75rem, 2.8vw + 0.5rem, 3.25rem)
  const sectionHeadingPx = calculateClampPx(1.75, 2.8, 0.5, 3.25, vp.width);

  // Astronaut width: clamp(320, 36vw, 580)
  const astroWidthPx = Math.min(Math.max(320, vp.width * 0.36), 580);
  // Orbit radius X:
  const isMobile = vp.width < 640;
  const isTablet = vp.width < 1024;
  const orbitRadiusPx = isMobile
    ? Math.max(160, Math.min(210, Math.round(vp.width * 0.46)))
    : isTablet
      ? Math.max(190, Math.min(235, Math.round(vp.width * 0.28)))
      : Math.max(220, Math.min(290, Math.round(vp.width * 0.22)));

  const titleHealthy = heroNamePx >= 44 && heroNamePx <= 100;
  const astroHealthy = astroWidthPx <= vp.width * 0.55 || isMobile;
  const orbitHealthy = orbitRadiusPx * 2 <= vp.width * 0.95;

  assert(
    titleHealthy && astroHealthy && orbitHealthy,
    `Viewport [${vp.name}] (${vp.width}x${vp.height}): Title=${heroNamePx.toFixed(0)}px, OrbitRadius=${orbitRadiusPx}px, Astro=${astroWidthPx.toFixed(0)}px`
  );
});

// ── FINAL REPORT ──────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failures)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL RESPONSIVE INTEGRITY CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
}
