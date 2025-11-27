/**
 * PortfolioCard - Individual expandable/blooming card for portfolio items
 * Smooth expand/collapse with progressive disclosure of information
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PortfolioCardProps {
  emoji?: string;
  title: string;
  description?: string;
  content?: string;
  metadata?: { [key: string]: any };
  type?: string;
}

export function PortfolioCard({
  emoji = '📋',
  title,
  description,
  content,
  metadata,
  type = 'default',
}: PortfolioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="group cursor-pointer"
    >
      {/* Card container with smooth expansion */}
      <motion.div
        layout="position"
        className="relative rounded-lg border border-white/10 overflow-hidden bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm hover:border-white/20 transition-colors cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          boxShadow: isExpanded
            ? '0 20px 40px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
      >
        {/* Header - always visible */}
        <motion.div
          layout="position"
          className="p-4 md:p-6 flex items-start justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl" aria-hidden="true">{emoji}</span>
              <motion.h3
                layout="position"
                className="text-base md:text-lg font-medium text-[#F5F5F5] truncate"
              >
                {title}
              </motion.h3>
            </div>

            {/* Collapsed view - short description */}
            {!isExpanded && description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs md:text-sm text-[#4A4A4A] line-clamp-2"
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Expand/collapse indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 text-[#4A4A4A]"
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>

        {/* Expanded content - smooth bloom */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="overflow-hidden"
            >
              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-white/5" />

              {/* Full content area */}
              <div className="p-4 md:p-6 space-y-4">
                {/* Full description */}
                {description && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-sm text-[#E8E8E8] leading-relaxed">
                      {description}
                    </p>
                  </motion.div>
                )}

                {/* Main content */}
                {content && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-sm text-[#4A4A4A] leading-relaxed max-h-48 overflow-y-auto"
                  >
                    {content}
                  </motion.div>
                )}

                {/* Metadata tags */}
                {metadata && Object.keys(metadata).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {Object.entries(metadata).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-3 py-1 bg-white/5 rounded text-xs text-[#4A4A4A]"
                      >
                        {key}: {String(value).slice(0, 20)}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
