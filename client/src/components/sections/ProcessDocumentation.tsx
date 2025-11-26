import { motion } from 'framer-motion';
import { useState } from 'react';

const PROCESS_INSIGHTS = [
  {
    id: 'brand-evolution-process',
    project: 'Brand Evolution System',
    phase: 'Discovery',
    insight: 'Initial conversations revealed fragmentation wasn\'t a visual problem—it was a communication problem.',
    thinking: 'The team was using different language to describe the brand. Solved by creating a shared vocabulary first.',
    learned: 'Systems thinking principle: Understand communication patterns before redesigning visual systems.'
  },
  {
    id: 'brand-evolution-fail',
    project: 'Brand Evolution System',
    phase: 'First Attempt (Failed)',
    insight: 'Created a massive 200-page brand guide. Client couldn\'t use it.',
    thinking: 'Mistook comprehensiveness for usability. Realized the guide needed to be a tool, not a document.',
    learned: 'Embodied practice lesson: Test with real users immediately. Don\'t wait for "perfection."'
  },
  {
    id: 'experience-mapping-iteration',
    project: 'Customer Journey Orchestration',
    phase: 'Mapping Phase',
    insight: 'Customer data showed one story. Real interviews told a completely different one.',
    thinking: 'Quantitative metrics miss emotional truth. Had to map emotional peaks and valleys, not just conversion points.',
    learned: 'Systems thinking: The "purpose of the system is what it does"—and what it was doing was creating frustration.'
  },
  {
    id: 'design-system-emergence',
    project: 'Living Design System',
    phase: 'Governance',
    insight: 'Tried to control how teams used components. Teams worked around the system instead.',
    thinking: 'Top-down design fails. Let patterns emerge from use, then codify them.',
    learned: 'Agency principle: People need freedom to adapt tools to their context. Design for emergence.'
  },
  {
    id: 'cross-project-connection',
    project: 'All Projects',
    phase: 'Meta-Learning',
    insight: 'Each project taught the same lesson in different languages: People > Systems > Process.',
    thinking: 'The three case studies aren\'t separate. They\'re one thesis told three ways.',
    learned: 'Rhizomatic thinking: Ideas connect unexpectedly when you look for the patterns.'
  }
];

export function ProcessDocumentation() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F5F5] mb-6">
            Behind the Work
          </h2>
          <p className="text-lg md:text-xl text-[#E8E8E8] max-w-2xl mx-auto leading-relaxed">
            The thinking, failures, and iterations that led to each project. What we learned about how systems, people, and craft intersect.
          </p>
        </motion.div>

        <div className="space-y-6">
          {PROCESS_INSIGHTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                style={{
                  background: 'linear-gradient(135deg, rgba(42,42,42,0.8) 0%, rgba(26,26,26,0.9) 100%)',
                }}
              >
                <div className="p-8 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs uppercase tracking-widest text-[#4A9EFF] font-medium">
                        {item.phase}
                      </span>
                      <span className="text-xs text-[#4A4A4A]">
                        {item.project}
                      </span>
                    </div>
                    <h3 className="text-xl font-light text-[#F5F5F5] mb-2">
                      {item.insight}
                    </h3>
                  </div>

                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#4A4A4A] flex-shrink-0"
                  >
                    <path
                      d="M4 7.5L10 12.5L16 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: expandedId === item.id ? 'auto' : 0,
                    opacity: expandedId === item.id ? 1 : 0
                  }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden border-t border-white/10"
                >
                  <div className="p-8 space-y-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-[#4A4A4A] mb-3">
                        What We Were Thinking
                      </h4>
                      <p className="text-[#E8E8E8] leading-relaxed">
                        {item.thinking}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-[#4A4A4A] mb-3">
                        Key Learning
                      </h4>
                      <p className="text-[#F5F5F5] leading-relaxed">
                        {item.learned}
                      </p>
                    </div>
                  </div>
                </motion.div>
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
            The work isn't finished when you ship—it's when you learn. Each project continues to teach us.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
