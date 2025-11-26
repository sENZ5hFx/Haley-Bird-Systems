import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

const PRACTICES = [
  {
    id: 'systems-thinking',
    title: 'Systems Thinking',
    description: 'Mapping interconnections, identifying leverage points, understanding feedback loops and emergent behavior.',
    rituals: ['Weekly systems mapping', 'Stakeholder ecosystem analysis', 'Long-form thinking sessions']
  },
  {
    id: 'embodied-design',
    title: 'Embodied Design Practice',
    description: 'Understanding through doing. Prototyping, iterating, and learning through hands-on creation.',
    rituals: ['Rapid prototyping cycles', 'Collaborative workshops', 'Physical and digital modeling']
  },
  {
    id: 'community-weaving',
    title: 'Community Weaving',
    description: 'Creating spaces where people can think together, collaborate intentionally, and build something meaningful.',
    rituals: ['Facilitated workshops', 'Collaborative ideation sessions', 'Open feedback loops']
  },
  {
    id: 'craft-consciousness',
    title: 'Craft Consciousness',
    description: 'Taking care with every detail. Understanding that how we do things matters as much as what we create.',
    rituals: ['Design critiques', 'Quality-first decision making', 'Iterative refinement']
  },
  {
    id: 'contextual-listening',
    title: 'Contextual Listening',
    description: 'Understanding the unique context, constraints, and opportunities before prescribing solutions.',
    rituals: ['Deep stakeholder interviews', 'Environmental analysis', 'Context mapping']
  },
  {
    id: 'emergence-cultivation',
    title: 'Emergence Cultivation',
    description: 'Creating conditions for unexpected insights and solutions to emerge rather than forcing predetermined outcomes.',
    rituals: ['Open-ended exploration', 'Cross-disciplinary synthesis', 'Possibility thinking']
  }
];

export function PracticesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-8 md:px-16"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: backgroundY,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F5F5] mb-6">
            Practices & Rituals
          </h2>
          <p className="text-lg md:text-xl text-[#E8E8E8] max-w-2xl mx-auto leading-relaxed">
            How the work gets done. The systems thinking, practices, and rituals that guide every project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRACTICES.map((practice, index) => (
            <motion.div
              key={practice.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-lg p-8 border border-white/10 hover:border-white/20 transition-colors h-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(42,42,42,0.8) 0%, rgba(26,26,26,0.9) 100%)',
                }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)`
                  }}
                />

                <div className="relative z-10">
                  <h3 className="text-2xl font-light text-[#F5F5F5] mb-3">
                    {practice.title}
                  </h3>
                  <p className="text-[#E8E8E8] text-sm leading-relaxed mb-6">
                    {practice.description}
                  </p>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#4A4A4A] mb-3">
                      Key Rituals
                    </p>
                    <ul className="space-y-2">
                      {practice.rituals.map((ritual, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 text-sm text-[#E8E8E8]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4A9EFF] mt-1.5 flex-shrink-0" />
                          <span>{ritual}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 bg-white/5 border border-white/10 rounded-lg p-8 md:p-12 text-center"
        >
          <p className="text-[#E8E8E8] text-lg leading-relaxed">
            These practices are not separate from the work—they <em>are</em> the work. Each project is an opportunity to refine, learn, and deepen these practices.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
