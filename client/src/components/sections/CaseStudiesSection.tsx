import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  challenge: string;
  approach: string;
  outcome: string;
  systemsThinking: string[];
  metrics: { label: string; value: string }[];
  color: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'brand-evolution',
    title: 'Brand Evolution System',
    category: 'Brand Strategy',
    description: 'A comprehensive brand transformation that unified disparate business units under a cohesive identity system.',
    challenge: 'Multiple sub-brands with inconsistent visual languages and messaging, leading to fragmented customer experience and internal confusion.',
    approach: 'Developed a modular brand architecture that maintains individual brand equity while creating clear parent-brand association through systematic color, typography, and voice guidelines.',
    outcome: 'Unified brand ecosystem that reduced design production time by 40% while increasing brand recognition scores across all segments.',
    systemsThinking: [
      'Mapped interconnections between sub-brands and customer touchpoints',
      'Identified leverage points for maximum brand cohesion impact',
      'Created feedback loops for continuous brand evolution',
      'Designed modular components that adapt to context while maintaining consistency'
    ],
    metrics: [
      { label: 'Brand Recognition', value: '+65%' },
      { label: 'Design Efficiency', value: '+40%' },
      { label: 'Customer Trust', value: '+28%' }
    ],
    color: '#4A9EFF'
  },
  {
    id: 'experience-mapping',
    title: 'Customer Journey Orchestration',
    category: 'Experience Design',
    description: 'End-to-end service design that transformed fragmented customer touchpoints into a seamless, emotionally resonant journey.',
    challenge: 'Disconnected customer experiences across digital and physical channels, resulting in high churn and low engagement scores.',
    approach: 'Applied systems thinking to map the entire customer ecosystem, identifying emotional highs and lows, then redesigned key moments to create memorable peaks while eliminating friction.',
    outcome: 'Holistic experience system that increased customer lifetime value by 55% and transformed detractors into brand advocates.',
    systemsThinking: [
      'Traced customer journey as interconnected emotional experiences',
      'Identified system delays and bottlenecks causing frustration',
      'Created positive reinforcement loops at key decision points',
      'Established cross-functional collaboration systems for sustained improvement'
    ],
    metrics: [
      { label: 'Customer LTV', value: '+55%' },
      { label: 'NPS Score', value: '+42pts' },
      { label: 'Churn Reduction', value: '-35%' }
    ],
    color: '#FF6B6B'
  },
  {
    id: 'design-system',
    title: 'Living Design System',
    category: 'Systems Design',
    description: 'A self-evolving design system that grows with the organization while maintaining coherence and enabling rapid innovation.',
    challenge: 'Design debt accumulating faster than teams could address, with inconsistent patterns across products slowing development and diluting brand experience.',
    approach: 'Created a design system as a living organism—with clear DNA (core principles), adaptable cells (components), and growth mechanisms (contribution guidelines and governance).',
    outcome: 'Adaptive design ecosystem that reduced design-to-development handoff time by 60% while enabling 3x faster feature iteration.',
    systemsThinking: [
      'Designed the system to self-organize through clear contribution paths',
      'Built in natural selection for pattern evolution',
      'Created information flows between design and development teams',
      'Established governance as lightweight guidance rather than rigid control'
    ],
    metrics: [
      { label: 'Dev Velocity', value: '+60%' },
      { label: 'Design Consistency', value: '94%' },
      { label: 'Component Reuse', value: '3x' }
    ],
    color: '#9B59B6'
  }
];

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative"
    >
      <motion.div
        className="relative overflow-hidden rounded-lg cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(42,42,42,0.9) 0%, rgba(26,26,26,0.95) 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: study.color }}
        />
        
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <span
                className="inline-block text-xs font-medium tracking-widest uppercase mb-2 px-3 py-1 rounded-full"
                style={{ backgroundColor: `${study.color}20`, color: study.color }}
              >
                {study.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-light text-[#F5F5F5]">
                {study.title}
              </h3>
            </div>
            
            <div className="flex gap-4">
              {study.metrics.map((metric, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-xl md:text-2xl font-medium"
                    style={{ color: study.color }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-xs text-[#E8E8E8] uppercase tracking-wide">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-[#E8E8E8] text-lg leading-relaxed mb-6">
            {study.description}
          </p>
          
          <motion.div
            initial={false}
            animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-white/10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-[#4A4A4A] mb-3">
                    The Challenge
                  </h4>
                  <p className="text-[#E8E8E8] leading-relaxed">
                    {study.challenge}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-[#4A4A4A] mb-3">
                    The Approach
                  </h4>
                  <p className="text-[#E8E8E8] leading-relaxed">
                    {study.approach}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm uppercase tracking-widest text-[#4A4A4A] mb-4">
                  Systems Thinking Application
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {study.systemsThinking.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -20 }}
                      transition={{ duration: 0.4, delay: 0.1 * i }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: study.color }}
                      />
                      <span className="text-[#E8E8E8] text-sm leading-relaxed">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm uppercase tracking-widest text-[#4A4A4A] mb-3">
                  The Outcome
                </h4>
                <p className="text-[#F5F5F5] text-lg leading-relaxed">
                  {study.outcome}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="flex items-center gap-2 mt-6 text-sm text-[#4A4A4A]"
            animate={{ opacity: expanded ? 0.5 : 1 }}
          >
            <span>{expanded ? 'Click to collapse' : 'Click to explore'}</span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </div>
        
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${study.color}10 0%, transparent 60%)`
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function CaseStudiesSection() {
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
            Case Studies
          </h2>
          <p className="text-lg md:text-xl text-[#E8E8E8] max-w-2xl mx-auto leading-relaxed">
            Exploring the interconnections between brand, experience, and systems thinking
            to create transformative outcomes.
          </p>
        </motion.div>

        <div className="space-y-8">
          {CASE_STUDIES.map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-[#4A4A4A] text-lg mb-6">
            Each project is an opportunity to see the bigger picture
          </p>
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-[#E8E8E8] cursor-pointer hover:border-white/30 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Full Portfolio</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
