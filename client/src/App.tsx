import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, lazy } from "react";
import { useExperience } from "./lib/stores/useExperience";
import { Scene } from "./components/three/Scene";
import { CustomCursor } from "./components/CustomCursor";
import { LoadingScreen } from "./components/LoadingScreen";
import { SoundToggle } from "./components/SoundToggle";
import { HeroSection } from "./components/sections/HeroSection";
import { StatementSection } from "./components/sections/StatementSection";
import { trackWebVitals } from "./lib/utils/performanceMonitoring";
import "@fontsource/inter";

// Lazy load heavy sections
const PortalsSection = lazy(() => import("./components/sections/PortalsSection").then(m => ({ default: m.PortalsSection })));
const RoomsSection = lazy(() => import("./components/sections/RoomsSection").then(m => ({ default: m.RoomsSection })));
const CaseStudiesSection = lazy(() => import("./components/sections/CaseStudiesSection").then(m => ({ default: m.CaseStudiesSection })));
const FooterSection = lazy(() => import("./components/sections/FooterSection").then(m => ({ default: m.FooterSection })));

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress } = useExperience();
  
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
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);
  
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <LoadingScreen />
      <CustomCursor />
      
      <div className="canvas-container">
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
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      
      <main className="content-layer" style={{ position: 'relative' }}>
        <HeroSection />
        <StatementSection />
        <Suspense fallback={null}>
          <PortalsSection />
          <RoomsSection />
          <CaseStudiesSection />
          <FooterSection />
        </Suspense>
      </main>
      
      <SoundToggle />
      
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

export default App;
