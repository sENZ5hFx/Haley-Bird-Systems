import { motion } from 'framer-motion';
import { useState } from 'react';

const GARDEN_CONCEPTS = [
  {
    id: 'seeds',
    label: 'Seeds',
    description: 'Emerging ideas and explorations',
    color: '#9B59B6'
  },
  {
    id: 'saplings', 
    label: 'Saplings',
    description: 'Developing concepts and frameworks',
    color: '#4A9EFF'
  },
  {
    id: 'fruits',
    label: 'Fruits',
    description: 'Complete projects and systems',
    color: '#FF6B6B'
  },
  {
    id: 'connections',
    label: 'Connections',
    description: 'How ideas interconnect',
    color: '#2ECC71'
  }
];

export function GardenNav() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen py-32 px-8 md:px-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#F5F5F5] mb-6">
            The Garden
          </h2>
          <p className="text-lg md:text-xl text-[#E8E8E8] max-w-3xl mx-auto leading-relaxed">
            A living, interconnected collection of thinking. Not a hierarchy, but a rhizome—where ideas cross-pollinate, concepts link unexpectedly, and growth happens in unexpected directions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {GARDEN_CONCEPTS.map((concept, index) => (
            <motion.button
              key={concept.id}
              onClick={() => setActiveSection(activeSection === concept.id ? null : concept.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="text-left relative overflow-hidden rounded-lg p-8 border border-white/10 hover:border-white/30 transition-colors"
              style={{
                background: `linear-gradient(135deg, rgba(42,42,42,0.9) 0%, rgba(26,26,26,0.95) 100%)`,
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${concept.color}10 0%, transparent 100%)`,
                }}
              />
              
              <div className="relative z-10">
                <div
                  className="w-3 h-3 rounded-full mb-4"
                  style={{ backgroundColor: concept.color }}
                />
                <h3 className="text-2xl font-light text-[#F5F5F5] mb-2">
                  {concept.label}
                </h3>
                <p className="text-[#E8E8E8] text-sm leading-relaxed">
                  {concept.description}
                </p>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: activeSection === concept.id ? 1 : 0,
                    height: activeSection === concept.id ? 'auto' : 0
                  }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  {concept.id === 'seeds' && (
                    <ul className="space-y-2 text-sm text-[#E8E8E8]">
                      <li>• Brand system thinking</li>
                      <li>• Experience ecosystems</li>
                      <li>• Spatial design patterns</li>
                      <li>• Community & agency</li>
                    </ul>
                  )}
                  {concept.id === 'saplings' && (
                    <ul className="space-y-2 text-sm text-[#E8E8E8]">
                      <li>• Design frameworks</li>
                      <li>• Process documentation</li>
                      <li>• Systems thinking applications</li>
                      <li>• Methodological explorations</li>
                    </ul>
                  )}
                  {concept.id === 'fruits' && (
                    <ul className="space-y-2 text-sm text-[#E8E8E8]">
                      <li>• Brand Evolution System</li>
                      <li>• Customer Journey Orchestration</li>
                      <li>• Living Design System</li>
                      <li>• Immersive experiences</li>
                    </ul>
                  )}
                  {concept.id === 'connections' && (
                    <ul className="space-y-2 text-sm text-[#E8E8E8]">
                      <li>• Systems thinking across projects</li>
                      <li>• Recurring design patterns</li>
                      <li>• Cross-domain insights</li>
                      <li>• Emergent principles</li>
                    </ul>
                  )}
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-lg p-8 md:p-12 text-center"
        >
          <p className="text-[#E8E8E8] text-lg leading-relaxed mb-6">
            Each project is not isolated, but part of an interconnected ecosystem. Ideas from one domain inform another. Patterns repeat. Connections emerge.
          </p>
          <p className="text-[#4A4A4A] text-sm">
            Like a garden, this work grows through intention, care, and the natural cross-pollination of ideas.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
