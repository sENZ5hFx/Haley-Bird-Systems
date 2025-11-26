# Haley Bird — Brand & Systems Architect

A sophisticated personal website functioning as an immersive interactive art installation and **living digital garden**, serving as both a living resume and studio showcase that combines refined design with systems thinking philosophy.

## Overview

This website is designed to feel like stepping into a carefully crafted creative space where visitors become active participants. The experience combines 3D visualization, particle systems, and atmospheric interactions to create an installation-like environment—but crucially, it's structured like a **digital garden**, not a portfolio.

Inspired by Jacky Zhao's approach to networked thinking, the site embraces rhizomatic (interconnected) rather than hierarchical navigation, showing how ideas cross-pollinate and inform each other across different projects and domains.

## Architecture & Philosophy

### The Garden Metaphor

Following digital garden principles:
- **Seeds**: Emerging ideas and explorations
- **Saplings**: Developing concepts and frameworks  
- **Fruits**: Complete projects and polished systems
- **Connections**: How ideas and projects link unexpectedly

This structure emphasizes:
- **Non-hierarchical navigation** - Ideas connect by concept, not category
- **Rhizomatic thinking** - Unexpected cross-connections between domains
- **Work-in-progress visibility** - Show the thinking, not just results
- **Embodied learning** - Understanding through doing and iterating

### Frontend (React + Three.js)
- **3D Engine**: React Three Fiber with Three.js for immersive WebGL visualization
- **Animation**: Framer Motion for UI animations, native Three.js for 3D motion
- **Styling**: Tailwind CSS with color palette reflecting sophistication
- **State Management**: Zustand for experience state (scroll, cursor, audio)
- **Performance**: Adaptive quality settings, code splitting, service worker caching

### Key Components

```
client/src/
├── components/
│   ├── three/
│   │   ├── Scene.tsx              # Main 3D scene
│   │   ├── ParticleField.tsx      # Adaptive particle system
│   │   ├── SpatialAudioController # Position-based audio
│   │   └── [other 3D components]
│   ├── sections/
│   │   ├── HeroSection.tsx        # Entry experience
│   │   ├── StatementSection.tsx   # Philosophy & approach
│   │   ├── PortalsSection.tsx     # Audience-specific lenses
│   │   ├── GardenNav.tsx          # Seeds/Saplings/Fruits navigation
│   │   ├── PracticesSection.tsx   # How the work gets done
│   │   ├── CaseStudiesSection.tsx # Projects + systems thinking
│   │   ├── RoomsSection.tsx       # Immersive zone exploration
│   │   └── FooterSection.tsx
│   ├── CustomCursor.tsx
│   ├── LoadingScreen.tsx
│   └── SoundToggle.tsx
├── lib/
│   ├── stores/
│   │   ├── useExperience.tsx
│   │   ├── useAudio.tsx
│   │   ├── useSpatialAudio.tsx
│   │   └── useRooms.tsx
│   └── utils/
│       ├── performanceMonitoring.ts  # Core Web Vitals tracking
│       └── deviceCapability.ts       # Adaptive quality detection
└── App.tsx
```

## Design System

### Color Palette
- **Primary**: #1A1A1A (deep charcoal) - backgrounds
- **Secondary**: #F5F5F5 (warm white) - primary text
- **Accent**: #E8E8E8 (soft grey) - secondary text
- **Interactive**: #4A4A4A (medium grey) - UI elements
- **Highlight**: #FFFFFF (pure white) - emphasis

### Typography
- Font: Inter (Google Fonts)
- Weights: 300 (light), 400 (regular), 500 (medium)
- Style: Generous whitespace, sophisticated hierarchy

## Features

### 1. Immersive 3D Installation
- Particle field responds to mouse/scroll movement
- Adaptive quality based on device capability (mobile: 1000 particles, desktop: 5000)
- WebGL shader effects (god rays, chromatic aberration, film grain)
- Post-processing for atmospheric depth

### 2. Digital Garden Navigation
- Seeds → Saplings → Fruits progression
- Concept-based linking (ideas connect across domains)
- Shows interconnections between projects
- Rhizomatic vs hierarchical structure

### 3. Practices & Rituals Section
- Shows HOW the work gets done
- Six core practices:
  - Systems Thinking
  - Embodied Design Practice
  - Community Weaving
  - Craft Consciousness
  - Contextual Listening
  - Emergence Cultivation

### 4. Case Studies with Systems Thinking
- Three detailed projects showing:
  - Challenge/Approach/Outcome
  - Systems thinking application
  - Measurable impact
  - Design process breakdown

### 5. Audience-Specific Portals
- Hiring Managers → Skills & Experience
- Collaborators → Process & Philosophy
- Project Opportunities → Capabilities & Impact

### 6. Spatial Audio System
- Position-based audio changes as user scrolls
- 3D sound positioning using Howler.js
- Atmospheric ambient soundscapes

### 7. Performance Optimizations
- **Core Web Vitals Monitoring**: LCP, INP, CLS tracking
- **Adaptive Quality**: Device detection for particles, textures, post-processing
- **Code Splitting**: Heavy sections lazy-loaded
- **Service Worker**: Offline support, asset caching
- **Spatial Audio**: Web Audio API (not HTML5) for better performance

## Recent Changes

- 2024-11-26: Performance optimization blitz
  - Added Core Web Vitals monitoring and device capability detection
  - Implemented adaptive quality settings (mobile: 1000 particles vs desktop: 5000)
  - Added code splitting with lazy loading for sections
  - Implemented service worker for caching and offline support
  - Optimized audio system for performance

- 2024-11-26: Digital garden transformation
  - Created GardenNav component showing Seeds/Saplings/Fruits structure
  - Added PracticesSection showcasing 6 core design practices
  - Restructured content around rhizomatic (interconnected) thinking
  - Added emphasis on process, not just results
  - Inspired by Jacky Zhao's networked thinking approach

## User Preferences & Philosophy

- Dark, sophisticated aesthetic
- Immersive art installation feel  
- Minimal traditional UI elements
- Emphasis on spatial navigation and experience
- Systems thinking as core lens
- Process-oriented (show the work, iterations, thinking)
- Community and intentionality
- Craft consciousness (quality in details)
- Embodied learning and doing
- Rhizomatic connections over hierarchy

## Performance Targets

✅ **LCP** (Largest Contentful Paint): < 2.5s
✅ **INP** (Interaction to Next Paint): < 200ms  
✅ **CLS** (Cumulative Layout Shift): < 0.1
✅ **Mobile**: Adaptive particle rendering (1000 particles)
✅ **Desktop**: Full visual experience (5000 particles)

## Inspiration Sources

- [jzhao.xyz](https://jzhao.xyz/) - Digital garden philosophy, networked thinking, craft consciousness, community-centered design
- Jacky Zhao's approach to systems thinking, embodied learning, and intentional living
- Seeds/Saplings/Fruits knowledge progression model
- Rhizomatic vs arborescent thinking

## Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Service Worker
- Located at `/public/sw.js`
- Automatically caches assets and HTML
- Provides offline support

## Next Steps & Opportunities

1. **Deep interconnection mapping** - Show how projects, practices, and ideas link
2. **Thought progression** - Add seeds section with evolving thoughts
3. **Community features** - Highlight collaborations and partnerships
4. **Process documentation** - Show sketches, iterations, failures
5. **Interactive systems diagrams** - Visualize systems thinking in projects
6. **Seasonal reflections** - Year-end letters (Jacky-inspired)
