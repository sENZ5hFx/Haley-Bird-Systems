/**
 * Main App Component - Room-Based Navigation Model
 * 
 * Architecture:
 * - Hero + 3D Scene: Always visible at top (immersive entry)
 * - Navigation: Only ONE content section visible at a time (room-switching, not scrolling)
 * - State: activeSection controls which room is displayed
 * - Ambience: Scene mood shifts based on activeSection
 * 
 * This replaces endless scroll with discrete, immersive "rooms" you step into.
 */

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, lazy, useState } from "react";
import { useExperience } from "./lib/stores/useExperience";
import { Scene } from "./components/three/Scene";
import { CustomCursor } from "./components/CustomCursor";
import { LoadingScreen } from "./components/LoadingScreen";
import { SoundToggle } from "./components/SoundToggle";
import { HeroSection } from "./components/sections/HeroSection";
import { trackWebVitals } from "./lib/utils/performanceMonitoring";
import { SectionId } from "./types";
import "@fontsource/inter";

// Lazy load room sections to keep initial bundle small
const StatementSection = lazy(() => import("./components/sections/StatementSection").then(m => ({ default: m.StatementSection })));
const PortalsSection = lazy(() => import("./components/sections/PortalsSection").then(m => ({ default: m.PortalsSection })));
const PersonalJourney = lazy(() => import("./components/sections/PersonalJourney").then(m => ({ default: m.PersonalJourney })));
const GardenNav = lazy(() => import("./components/sections/GardenNav").then(m => ({ default: m.GardenNav })));
const PracticesSection = lazy(() => import("./components/sections/PracticesSection").then(m => ({ default: m.PracticesSection })));
const InteractiveConnections = lazy(() => import("./components/sections/InteractiveConnections").then(m => ({ default: m.InteractiveConnections })));
const ProcessDocumentation = lazy(() => import("./components/sections/ProcessDocumentation").then(m => ({ default: m.ProcessDocumentation })));
const CaseStudiesSection = lazy(() => import("./components/sections/CaseStudiesSection").then(m => ({ default: m.CaseStudiesSection })));
const RoomsSection = lazy(() => import("./components/sections/RoomsSection").then(m => ({ default: m.RoomsSection })));
const FooterSection = lazy(() => import("./components/sections/FooterSection").then(m => ({ default: m.FooterSection })));

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setActiveSection, activeSection: storeActiveSection } = useExperience();
  
  // Local activeSection state - this is the "room selector"
  // Starts at 'statement' (first room after hero)
  const [activeSection, setLocalActiveSection] = useState<SectionId>('statement');
  
  // Sync with store for other parts of the app that might need it
  useEffect(() => {
    setActiveSection(activeSection);
  }, [activeSection, setActiveSection]);

  useEffect(() => {
    // Register service worker for offline support and caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => 
        console.log('SW registration failed:', err)
      );
    }

    // Track Core Web Vitals
    trackWebVitals();
  }, []);

  // Map section to component for dynamic rendering
  // Only render one room at a time after hero
  const renderActiveSection = () => {
    const roomMap: Record<SectionId, React.ComponentType<{ onSectionChange?: (id: SectionId) => void }>> = {
      'statement': StatementSection,
      'portals': PortalsSection,
      'journey': PersonalJourney,
      'garden': GardenNav,
      'practices': PracticesSection,
      'connections': InteractiveConnections,
      'process': ProcessDocumentation,
      'cases': CaseStudiesSection,
      'rooms': RoomsSection,
      'footer': FooterSection,
      'hero': () => null, // Hero rendered separately
    };

    const Component = roomMap[activeSection];
    if (!Component) return null;

    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <Component onSectionChange={setLocalActiveSection} />
      </Suspense>
    );
  };
  
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <LoadingScreen />
      <CustomCursor />
      
      {/* Shared 3D environment - always visible, mood adapts to active section */}
      <div className="canvas-container fixed inset-0 pointer-events-none z-0">
        <Canvas
          camera={{
            position: [0, 0, 15],
            fov: 60,
            near: 0.1,
            far: 100
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene activeSection={activeSection} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Content layer - room-based navigation, not scroll-based */}
      <main className="content-layer relative z-10" style={{ position: 'relative' }}>
        {/* Hero: always shown, acts as entry point to navigate between rooms */}
        <HeroSection onEnter={setLocalActiveSection} />
        
        {/* Active Room: only one visible at a time */}
        <div className="min-h-screen flex items-center justify-center">
          {renderActiveSection()}
        </div>
      </main>
      
      <SoundToggle />
      
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

export default App;
