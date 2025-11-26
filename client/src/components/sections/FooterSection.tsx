import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useExperience } from '@/lib/stores/useExperience';

export function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: '-10%' });
  const { setCursorState } = useExperience();
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  
  const contactLinks = [
    { label: 'Email', value: 'hello@haleybird.com', href: 'mailto:hello@haleybird.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/haleybird', href: 'https://linkedin.com' },
    { label: 'Twitter', value: '@haleybird', href: 'https://twitter.com' },
  ];
  
  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-end pb-12 px-6 md:px-12 lg:px-24"
      style={{ opacity }}
    >
      <motion.div
        ref={contentRef}
        style={{ y }}
        className="w-full max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#F5F5F5] tracking-[-0.02em] mb-6">
            Let's build<br />
            <span className="text-[#4A4A4A]">something meaningful</span>
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] max-w-md font-light">
            Whether you're looking for a strategic partner, a creative collaborator, 
            or simply want to connect—I'd love to hear from you.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {contactLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
              className="group block"
              onMouseEnter={() => setCursorState('pointer')}
              onMouseLeave={() => setCursorState('default')}
            >
              <span className="text-xs tracking-[0.2em] uppercase text-[#4A4A4A] block mb-2">
                {link.label}
              </span>
              <span className="text-base md:text-lg text-[#E8E8E8] group-hover:text-[#F5F5F5] transition-colors duration-300 font-light">
                {link.value}
              </span>
              <motion.div
                className="h-[1px] bg-[#4A4A4A] mt-2 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-8 border-t border-[#2A2A2A] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#4A4A4A] font-light">
              © {new Date().getFullYear()} Haley Bird
            </span>
            <span className="w-1 h-1 bg-[#4A4A4A] rounded-full" />
            <span className="text-xs text-[#4A4A4A] font-light">
              Brand & Systems Architect
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#4A4A4A] font-light">
              Designed with intention
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
