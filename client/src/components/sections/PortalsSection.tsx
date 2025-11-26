import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';

interface PortalCard {
  id: string;
  title: string;
  description: string;
  details: string[];
  notionUrl: string;
}

const portals: PortalCard[] = [
  {
    id: 'hiring',
    title: 'For Hiring Managers',
    description: 'A comprehensive view of skills, experience, and professional trajectory.',
    details: ['Strategic Leadership', 'Brand Development', 'Team Collaboration', 'Measurable Impact'],
    notionUrl: '#hiring-resume'
  },
  {
    id: 'collaborators',
    title: 'For Collaborators',
    description: 'How I work, think, and approach creative challenges together.',
    details: ['Design Philosophy', 'Process & Methodology', 'Communication Style', 'Shared Values'],
    notionUrl: '#collaborator-profile'
  },
  {
    id: 'projects',
    title: 'For Project Opportunities',
    description: 'Capabilities and the kinds of impact I can bring to your initiative.',
    details: ['Service Offerings', 'Case Studies', 'Availability', 'Engagement Models'],
    notionUrl: '#project-capabilities'
  }
];

export function PortalsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { setCursorState } = useExperience();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6 md:px-12 lg:px-24"
      style={{ opacity }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-10%' }}
          className="mb-20"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-[#4A4A4A] font-light block mb-4">
            Choose Your Lens
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F5F5] tracking-[-0.02em]">
            Different perspectives,<br />
            <span className="text-[#4A4A4A]">tailored experiences</span>
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {portals.map((portal, i) => (
            <PortalCardComponent
              key={portal.id}
              portal={portal}
              index={i}
              setCursorState={setCursorState}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function PortalCardComponent({ 
  portal, 
  index,
  setCursorState 
}: { 
  portal: PortalCard; 
  index: number;
  setCursorState: (state: 'default' | 'hover' | 'pointer' | 'explore') => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-10%' });
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      <motion.a
        href={portal.notionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
        onMouseEnter={() => setCursorState('pointer')}
        onMouseLeave={() => setCursorState('default')}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative p-8 lg:p-10 border border-[#2A2A2A] rounded-sm bg-[#1A1A1A]/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A]/0 via-transparent to-[#2A2A2A]/0 group-hover:from-[#2A2A2A]/20 group-hover:to-transparent transition-all duration-500" />
          
          <div className="relative z-10">
            <div className="w-8 h-8 mb-8 relative">
              <div className="absolute inset-0 border border-[#4A4A4A] rounded-full group-hover:border-[#E8E8E8] transition-colors duration-300" />
              <div className="absolute inset-2 border border-[#4A4A4A]/50 rounded-full group-hover:border-[#E8E8E8]/50 transition-colors duration-300" />
            </div>
            
            <h3 className="text-xl lg:text-2xl font-light text-[#F5F5F5] mb-4 tracking-[-0.01em]">
              {portal.title}
            </h3>
            
            <p className="text-sm text-[#4A4A4A] mb-8 leading-relaxed font-light">
              {portal.description}
            </p>
            
            <ul className="space-y-2 mb-8">
              {portal.details.map((detail, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.15 + i * 0.1 + 0.3 }}
                  className="text-xs text-[#E8E8E8]/60 flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-[#4A4A4A] rounded-full group-hover:bg-[#E8E8E8] transition-colors duration-300" />
                  {detail}
                </motion.li>
              ))}
            </ul>
            
            <div className="flex items-center gap-3 text-xs text-[#4A4A4A] group-hover:text-[#E8E8E8] transition-colors duration-300">
              <span className="tracking-[0.15em] uppercase">Explore</span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </div>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}
