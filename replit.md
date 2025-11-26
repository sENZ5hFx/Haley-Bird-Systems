# Haley Bird — Brand & Systems Architect

A sophisticated personal website functioning as an immersive interactive art installation, serving as both a living resume and studio showcase that combines refined design with systems thinking philosophy.

## Overview

This website is designed to feel like stepping into a carefully crafted creative space where visitors become active participants. The experience combines 3D visualization, particle systems, and atmospheric interactions to create an installation-like environment.

## Architecture

### Frontend (React + Three.js)
- **3D Engine**: React Three Fiber with Three.js for immersive WebGL visualization
- **Animation**: Framer Motion for UI animations, native Three.js for 3D motion
- **Styling**: Tailwind CSS with custom color palette
- **State Management**: Zustand for experience state (scroll, cursor, audio)

### Key Components

```
client/src/
├── components/
│   ├── three/           # 3D scene components
│   │   ├── Scene.tsx         # Main 3D scene composition
│   │   ├── ParticleField.tsx # Interactive particle system
│   │   ├── SystemsVisualization.tsx # Interconnected node network
│   │   ├── FloatingGeometry.tsx # Ambient geometric shapes
│   │   ├── AudiencePortals.tsx # 3D portal objects
│   │   └── AtmosphericLights.tsx # Dynamic lighting
│   ├── sections/        # Content sections
│   │   ├── HeroSection.tsx
│   │   ├── StatementSection.tsx
│   │   ├── PortalsSection.tsx
│   │   └── FooterSection.tsx
│   ├── CustomCursor.tsx # Reactive cursor system
│   ├── LoadingScreen.tsx # Initial loading experience
│   └── SoundToggle.tsx  # Audio controls
├── lib/stores/
│   ├── useExperience.tsx # Main experience state
│   └── useAudio.tsx      # Audio state management
└── App.tsx              # Main application
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

### Interactive 3D Visualization
- Particle field responds to mouse movement
- Systems visualization with interconnected nodes
- Floating geometry with ambient motion
- Post-processing effects (bloom, noise, vignette)

### Scroll-Based Journey
- Cinematic scroll progression
- Parallax depth layers
- Progressive content reveal
- Section-based opacity transitions

### Audience Portals (Lenses)
- Hiring Managers → Skills & Experience
- Collaborators → Process & Philosophy  
- Project Opportunities → Capabilities & Impact

### Atmospheric Elements
- Custom cursor with state-based transformations
- Film grain noise overlay
- Dynamic lighting based on scroll/mouse
- Optional ambient sound design

## Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Recent Changes

- 2024-11-26: Initial implementation of immersive art installation experience
  - Created fullscreen 3D canvas with particle systems
  - Built systems thinking visualization with interconnected nodes
  - Implemented scroll-based cinematic journey
  - Added audience-specific portals with Notion link integration
  - Created custom cursor with context-aware states
  - Added atmospheric post-processing effects
  - Implemented loading screen and sound toggle

## User Preferences

- Dark, sophisticated aesthetic
- Immersive art installation feel
- Minimal traditional UI elements
- Emphasis on spatial navigation
- Responsive interaction design
