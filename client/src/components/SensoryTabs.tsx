import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import * as THREE from 'three';

type TabType = 'seeds' | 'saplings' | 'fruits';

interface Tab {
  id: TabType;
  label: string;
  description: string;
  color: string;
  soundFreq: number;
  lightIntensity: number;
  particleCount: number;
}

const TABS: Tab[] = [
  {
    id: 'seeds',
    label: 'Seeds',
    description: 'Emerging ideas & explorations (739 total)',
    color: '#4A9EFF',
    soundFreq: 440,
    lightIntensity: 0.5,
    particleCount: 30
  },
  {
    id: 'saplings',
    label: 'Saplings',
    description: 'Developing concepts & frameworks',
    color: '#2ECC71',
    soundFreq: 520,
    lightIntensity: 0.7,
    particleCount: 60
  },
  {
    id: 'fruits',
    label: 'Fruits',
    description: 'Complete projects & polished systems (28 published)',
    color: '#F39C12',
    soundFreq: 659,
    lightIntensity: 1.0,
    particleCount: 100
  }
];

const SAMPLE_CONTENT = {
  seeds: [
    { title: 'Casual Magic', desc: 'Finding transcendence in everyday moments' },
    { title: 'Agency', desc: 'Design for people to shape their own experience' },
    { title: 'Playspace', desc: 'Weekly co-working & co-learning sessions' },
    { title: 'Form Fits Context', desc: 'How systems adapt to their environment' }
  ],
  saplings: [
    { title: 'Craft', desc: 'Celebrating the act of making itself' },
    { title: 'Networked Thought', desc: 'Building gardens of interconnected ideas' },
    { title: 'Digital Identity', desc: 'Authorship and presence in digital spaces' }
  ],
  fruits: [
    { title: 'Agentic Computing', desc: 'Making software that doesn\'t constrain' },
    { title: 'Digital Gardening', desc: 'Tending and growing ideas in public' },
    { title: 'Collaborative Thinking', desc: 'Thinking together, not at each other' },
    { title: 'Nothing Stops', desc: 'On time, presence, and what matters' }
  ]
};

export function SensoryTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('seeds');
  const activeTabData = TABS.find(t => t.id === activeTab)!;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Play sound on tab change
  useEffect(() => {
    playToneSequence(activeTabData.soundFreq);
  }, [activeTab]);

  const playToneSequence = (frequency: number) => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      // Audio context not available
    }
  };

  const content = SAMPLE_CONTENT[activeTab];

  return (
    <section className="relative min-h-screen py-32 px-8 md:px-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F5F5] mb-6">
            Explore the Garden
          </h2>
          <p className="text-lg md:text-xl text-[#E8E8E8] max-w-2xl mx-auto leading-relaxed">
            Navigate through stages of thinking: from emerging seeds to mature fruits. Each carries its own energy and lightness.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-4 md:gap-6 mb-12 justify-center flex-wrap">
          {TABS.map((tab, idx) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-8 py-4 rounded-lg font-light transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[#E8E8E8] hover:text-white'
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? `${tab.color}30` : 'transparent',
                borderColor: activeTab === tab.id ? tab.color : '#4A4A4A',
                borderWidth: '1px'
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  boxShadow: activeTab === tab.id 
                    ? `0 0 20px ${tab.color}80`
                    : 'none'
                }}
                className="relative"
              >
                <div className="text-sm uppercase tracking-widest">{tab.label}</div>
                <div className="text-xs text-[#4A4A4A]">{tab.particleCount} nodes</div>
              </motion.div>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${tab.color}40, transparent 70%)`
                  }}
                  initial={false}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Active Tab Description */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div
            className="inline-block px-6 py-3 rounded-lg border"
            style={{
              borderColor: activeTabData.color,
              background: `${activeTabData.color}15`
            }}
          >
            <p className="text-[#E8E8E8] text-lg">
              {activeTabData.description}
            </p>
          </div>
        </motion.div>

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {content.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative overflow-hidden rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer group"
              >
                {/* Sensory Background Gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${activeTabData.color}30, transparent 60%)`
                  }}
                />

                {/* Animated Border Glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  animate={hoveredIndex === idx ? { opacity: 1 } : { opacity: 0 }}
                  style={{
                    border: `2px solid ${activeTabData.color}`,
                    boxShadow: `0 0 20px ${activeTabData.color}60`
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-8">
                  <motion.div
                    animate={hoveredIndex === idx ? { x: 4 } : { x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-xl font-light text-[#F5F5F5] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#E8E8E8] text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>

                  {/* Hover Indicator */}
                  <motion.div
                    className="mt-4 text-xs uppercase tracking-widest"
                    style={{ color: activeTabData.color }}
                    animate={hoveredIndex === idx ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Explore →
                  </motion.div>
                </div>

                {/* Particle Effect Background */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
                  animate={hoveredIndex === idx ? { scale: 1.2, opacity: 20 } : { scale: 1, opacity: 10 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: `radial-gradient(circle, ${activeTabData.color}, transparent)`,
                    filter: 'blur(40px)'
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Sensory Feedback Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-white/5 border border-white/10 rounded-lg p-8 text-center"
        >
          <p className="text-[#E8E8E8] text-lg mb-4">
            Each stage carries a different energy:
          </p>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-[#4A9EFF] font-light mb-1">Seeds</div>
              <div className="text-[#4A4A4A]">Exploratory, nascent</div>
            </div>
            <div>
              <div className="text-[#2ECC71] font-light mb-1">Saplings</div>
              <div className="text-[#4A4A4A]">Developing, structured</div>
            </div>
            <div>
              <div className="text-[#F39C12] font-light mb-1">Fruits</div>
              <div className="text-[#4A4A4A]">Mature, complete</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
