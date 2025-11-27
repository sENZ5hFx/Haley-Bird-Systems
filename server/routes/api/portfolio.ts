/**
 * Portfolio API Route - Fetches Notion content for portfolio gallery
 * Organizes content from multiple workspaces with caching
 */

import { Router } from 'express';
import { scanNotionGarden } from '../../lib/notionScanner';

const router = Router();

// Cache for portfolio data
let portfolioCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Sample portfolio items - Used when Notion is empty or unavailable
 * Replace these with real Notion content by updating your workspace
 */
const SAMPLE_PORTFOLIO_ITEMS = [
  {
    id: 'sample-1',
    emoji: '🔧',
    title: 'Systems Thinking Practice',
    description: 'Core methodology for interconnected design',
    content: 'A framework for understanding how brands exist as living systems of relationships, touchpoints, and experiences that evolve together. This practice emphasizes seeing the whole system, not just isolated elements.',
    category: 'Practices',
    metadata: { type: 'practice', source: 'sample' },
  },
  {
    id: 'sample-2',
    emoji: '📋',
    title: 'Brand Redesign Case Study',
    description: 'Systems thinking applied to brand strategy',
    content: 'How a comprehensive brand system was designed to unify visual identity, voice, and customer experience across all touchpoints. Measurable impact on brand recognition and customer trust.',
    category: 'Projects',
    metadata: { type: 'case', source: 'sample' },
  },
  {
    id: 'sample-3',
    emoji: '🌱',
    title: 'Embodied Learning Journey',
    description: 'Personal essay on vulnerability and growth',
    content: 'Reflections on identity shifts, community connection, and the messy process of becoming. Real mastery comes not from reading alone, but from doing, iterating, and learning through embodied practice.',
    category: 'Journey',
    metadata: { type: 'journal', source: 'sample' },
  },
  {
    id: 'sample-4',
    emoji: '🕸️',
    title: 'Rhizomatic Thinking Network',
    description: 'How ideas interconnect across domains',
    content: 'A visual and conceptual map showing how practices, principles, and projects link unexpectedly. Networks over hierarchies: nothing stands alone.',
    category: 'Thinking',
    metadata: { type: 'connection', source: 'sample' },
  },
  {
    id: 'sample-5',
    emoji: '🔧',
    title: 'Community Weaving Ritual',
    description: 'Intentional practice for gathering people',
    content: 'How to create spaces where people with shared intention gather to think together, not just consume. Process-driven, authentic, co-creative.',
    category: 'Practices',
    metadata: { type: 'practice', source: 'sample' },
  },
  {
    id: 'sample-6',
    emoji: '📋',
    title: 'Design System Architecture',
    description: 'Building systems that scale intentionally',
    content: 'Creating comprehensive design systems that maintain consistency while allowing for flexibility and evolution. How constraints enable creativity.',
    category: 'Projects',
    metadata: { type: 'case', source: 'sample' },
  },
];

/**
 * Transform Notion content into portfolio items
 */
function transformToPortfolioItems(notionContent: any) {
  const items: any[] = [];

  // Add practices as portfolio items
  if (notionContent.practices && Array.isArray(notionContent.practices)) {
    notionContent.practices.forEach((practice: any, idx: number) => {
      items.push({
        id: `practice-${idx}`,
        emoji: '🔧',
        title: practice.title || 'Untitled Practice',
        description: 'Core methodology and approach',
        content: practice.description || '',
        category: 'Practices',
        metadata: { type: 'practice', url: practice.url },
      });
    });
  }

  // Add case studies as portfolio items
  if (notionContent.cases && Array.isArray(notionContent.cases)) {
    notionContent.cases.forEach((caseItem: any, idx: number) => {
      items.push({
        id: `case-${idx}`,
        emoji: '📋',
        title: caseItem.title || 'Untitled Project',
        description: 'Project case study and systems thinking breakdown',
        content: caseItem.description || '',
        category: 'Projects',
        metadata: { type: 'case', url: caseItem.url },
      });
    });
  }

  // Add journey entries as portfolio items
  if (notionContent.journey && Array.isArray(notionContent.journey)) {
    notionContent.journey.forEach((entry: any, idx: number) => {
      items.push({
        id: `journey-${idx}`,
        emoji: '🌱',
        title: entry.title || 'Untitled Entry',
        description: 'Personal essay and reflection',
        content: entry.description || '',
        category: 'Journey',
        metadata: { type: 'journal', url: entry.url },
      });
    });
  }

  // Add connections as portfolio items
  if (notionContent.connections && Array.isArray(notionContent.connections)) {
    notionContent.connections.forEach((connection: any, idx: number) => {
      items.push({
        id: `connection-${idx}`,
        emoji: '🕸️',
        title: connection.title || 'Untitled Connection',
        description: 'Networked idea and system thinking',
        content: connection.description || '',
        category: 'Thinking',
        metadata: { type: 'connection', url: connection.url },
      });
    });
  }

  return items;
}

/**
 * GET /api/portfolio - Fetch all portfolio items from Notion or use samples
 */
router.get('/', async (req, res) => {
  try {
    // Check cache
    if (portfolioCache && Date.now() - portfolioCache.timestamp < CACHE_TTL) {
      return res.json(portfolioCache.data);
    }

    // Fetch from Notion
    let items: any[] = [];
    try {
      const notionContent = await scanNotionGarden();
      console.log('Notion content received:', {
        practices: notionContent.practices?.length || 0,
        cases: notionContent.cases?.length || 0,
        journey: notionContent.journey?.length || 0,
        connections: notionContent.connections?.length || 0,
      });

      items = transformToPortfolioItems(notionContent);
      console.log('Transformed portfolio items from Notion:', items.length);
    } catch (notionError) {
      console.warn('Notion fetch failed, using sample portfolio:', notionError);
      // Fallback to sample items
      items = SAMPLE_PORTFOLIO_ITEMS;
    }

    // If still no items, use samples
    if (!items || items.length === 0) {
      console.log('No items found, using sample portfolio');
      items = SAMPLE_PORTFOLIO_ITEMS;
    }

    // Sort by category for better grouping
    items.sort((a, b) => a.category.localeCompare(b.category));

    const response = {
      items,
      total: items.length,
      categories: ['Projects', 'Thinking', 'Practices', 'Journey'],
      lastUpdated: new Date().toISOString(),
      source: items[0]?.metadata?.source === 'sample' ? 'sample' : 'notion',
    };

    // Cache the response
    portfolioCache = {
      data: response,
      timestamp: Date.now(),
    };

    console.log('Portfolio response:', { total: items.length, source: response.source });
    return res.json(response);
  } catch (error) {
    console.error('Portfolio API error:', error);
    // Final fallback: return samples even if there's an error
    return res.status(200).json({
      items: SAMPLE_PORTFOLIO_ITEMS,
      total: SAMPLE_PORTFOLIO_ITEMS.length,
      categories: ['Projects', 'Thinking', 'Practices', 'Journey'],
      lastUpdated: new Date().toISOString(),
      source: 'sample',
    });
  }
});

/**
 * GET /api/portfolio/:category - Fetch portfolio items by category
 */
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const notionContent = await scanNotionGarden();
    const items = transformToPortfolioItems(notionContent);

    const filteredItems = items.filter(
      item => item.category.toLowerCase() === category.toLowerCase()
    );

    return res.json({
      items: filteredItems,
      category,
      total: filteredItems.length,
    });
  } catch (error) {
    console.error('Portfolio category API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch portfolio category',
      items: [],
    });
  }
});

export default router;
