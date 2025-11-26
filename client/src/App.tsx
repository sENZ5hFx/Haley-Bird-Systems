import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { useExperience } from "./lib/stores/useExperience";
import { Scene } from "./components/three/Scene";
import { CustomCursor } from "./components/CustomCursor";
import { LoadingScreen } from "./components/LoadingScreen";
import { SoundToggle } from "./components/SoundToggle";
import { HeroSection } from "./components/sections/HeroSection";
import { StatementSection } from "./components/sections/StatementSection";
import { PortalsSection } from "./components/sections/PortalsSection";
import { FooterSection } from "./components/sections/FooterSection";
import "@fontsource/inter";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress } = useExperience();
  
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
        <PortalsSection />
        <FooterSection />
      </main>
      
      <SoundToggle />
      
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

export default App;
