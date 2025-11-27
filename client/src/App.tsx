/**
 * Main App Component - 3D Explorable Environment
 * 
 * NEW ARCHITECTURE:
 * - Hero section (introduction + entry button)
 * - 3D explorable room environment with OrbitControls (rotate, zoom, pan)
 * - Click any room to view its content in overlay
 * - Multiple rooms visible at once in isometric/3D view
 * 
 * This creates an immersive game-like experience similar to Apple Maps 3D
 */

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, lazy, useState } from "react";
import { useExperience } from "./lib/stores/useExperience";
import { InteractiveRoomEnvironment } from "./components/three/InteractiveRoomEnvironment";
import { RoomContentOverlay } from "./components/RoomContentOverlay";
import { CustomCursor } from "./components/CustomCursor";
import { LoadingScreen } from "./components/LoadingScreen";
import { SoundToggle } from "./components/SoundToggle";
import { HeroSection } from "./components/sections/HeroSection";
import { trackWebVitals } from "./lib/utils/performanceMonitoring";
import { SectionId } from "./types";
import "@fontsource/inter";

// Lazy load room section content
const StatementSection = lazy(() => import("./components/sections/StatementSection").then(m => ({ default: m.StatementSection })));
const PortalsSection = lazy(() => import("./components/sections/PortalsSection").then(m => ({ default: m.PortalsSection })));
const PersonalJourney = lazy(() => import("./components/sections/PersonalJourney").then(m => ({ default: m.PersonalJourney })));
const GardenNav = lazy(() => import("./components/sections/GardenNav").then(m => ({ default: m.GardenNav })));
const PracticesSection = lazy(() => import("./components/sections/PracticesSection").then(m => ({ default: m.PracticesSection })));
const InteractiveConnections = lazy(() => import("./components/sections/InteractiveConnections").then(m => ({ default: m.InteractiveConnections })));
const ProcessDocumentation = lazy(() => import("./components/sections/ProcessDocumentation").then(m => ({ default: m.ProcessDocumentation })));
const CaseStudiesSection = lazy(() => import("./components/sections/CaseStudiesSection").then(m => ({ default: m.CaseStudiesSection })));

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useExperience();
  
  // Hero shown initially, then environment + rooms
  const [showHero, setShowHero] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<SectionId | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => 
        console.log('SW registration failed:', err)
      );
    }
    trackWebVitals();
  }, []);

  // Room content mapper
  const getRoomContent = () => {
    const roomMap: Record<SectionId, React.ComponentType<any>> = {
      'statement': StatementSection,
      'portals': PortalsSection,
      'journey': PersonalJourney,
      'garden': GardenNav,
      'practices': PracticesSection,
      'connections': InteractiveConnections,
      'process': ProcessDocumentation,
      'cases': CaseStudiesSection,
    };

    if (!selectedRoom || !roomMap[selectedRoom]) return null;
    
    const Component = roomMap[selectedRoom];
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    );
  };

  const handleEnter = () => setShowHero(false);
  const handleRoomSelect = (roomId: SectionId) => {
    setSelectedRoom(roomId);
    setActiveSection(roomId);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <LoadingScreen />
      <CustomCursor />

      {/* 3D Canvas - Always in background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Canvas
          camera={{
            position: [15, 12, 15],
            fov: 60,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <InteractiveRoomEnvironment onRoomSelect={handleRoomSelect} />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero Section Overlay */}
      {showHero && (
        <div className="fixed inset-0 z-20 pointer-events-auto">
          <HeroSection onEnter={() => handleEnter()} />
        </div>
      )}

      {/* Room Content Overlay (when room selected) */}
      {selectedRoom && !showHero && (
        <RoomContentOverlay 
          roomId={selectedRoom} 
          onClose={() => setSelectedRoom(null)}
        >
          {getRoomContent()}
        </RoomContentOverlay>
      )}

      <SoundToggle />
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

export default App;
