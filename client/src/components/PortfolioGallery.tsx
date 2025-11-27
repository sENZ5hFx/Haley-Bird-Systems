/**
 * PortfolioGallery - Beautiful expandable portfolio view with Notion content
 * Progressive disclosure: summary → expand → details
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PortfolioCard } from './PortfolioCard';
import { X } from 'lucide-react';

interface PortfolioItem {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  content?: string;
  category: string;
  metadata?: { [key: string]: any };
}

interface PortfolioGalleryProps {
  onClose: () => void;
}

const CATEGORIES = ['Projects', 'Thinking', 'Practices', 'Journey', 'All'];

export function PortfolioGallery({ onClose }: PortfolioGalleryProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch portfolio data from backend
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading portfolio:', err);
        setError('Failed to load portfolio');
        setLoading(false);
      });
  }, []);

  // Filter items by category
  const filteredItems = items.filter(
    item => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Content container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full h-full max-w-5xl max-h-[90vh] mx-auto p-6 md:p-8 flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 id="portfolio-title" className="text-3xl md:text-4xl font-light text-[#F5F5F5] mb-2">
              Portfolio
            </h2>
            <p className="text-sm text-[#4A4A4A]">
              <span aria-label={`${filteredItems.length} items available`}>
                {filteredItems.length} items
              </span>
              {' '}• Click any card to expand and view details
            </p>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={24} className="text-[#E8E8E8]" />
          </motion.button>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CATEGORIES.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-white/15 text-[#F5F5F5] border border-white/20'
                  : 'bg-white/5 text-[#4A4A4A] hover:bg-white/10'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery grid */}
        <motion.div
          layout
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.1) rgba(255,255,255,0.05)',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#4A4A4A]">Loading portfolio...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-400">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#4A4A4A]">No items in this category</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4"
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <PortfolioCard
                    emoji={item.emoji}
                    title={item.title}
                    description={item.description}
                    content={item.content}
                    metadata={item.metadata}
                    type={item.category}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
