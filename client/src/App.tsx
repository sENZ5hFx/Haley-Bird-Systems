/**
 * LinkRenderer - Renders text with intelligent internal links
 * Uses the link resolver to parse and render clickable internal links
 */

import { parseTextLinks, SectionId } from '@/lib/linkResolver';
import { motion } from 'framer-motion';

interface LinkRendererProps {
  text: string;
  onNavigate: (roomId: SectionId) => void;
  className?: string;
}

export function LinkRenderer({ text, onNavigate, className = '' }: LinkRendererProps) {
  const parts = parseTextLinks(text);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return <span key={idx}>{part.content}</span>;
        }

        return (
          <motion.button
            key={idx}
            onClick={() => part.target && onNavigate(part.target)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-blue-400 hover:text-blue-300 underline cursor-pointer font-medium transition-colors"
          >
            {part.content}
          </motion.button>
        );
      })}
    </span>
  );
}
