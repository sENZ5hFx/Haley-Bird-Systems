/**
 * Portfolio API Route - Fetches Notion content for portfolio gallery
 * Organizes content from multiple workspaces with caching
 */

import { Router } from 'express';
import { scanNotionGarden } from '../../lib/notionScanner';

const router = Router();

let portfolioCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5;

const SAMPLE_PORTFOLIO_ITEMS = [
  {
    id: 'sample-1',
    emoji: '🔧',
    title: 'Systems Thinking Practice',
    description: 'Core methodology for interconnected design',
    content: 'A framework for understanding brands as living systems.',
    category: 'Practices',
    metadata: { type: 'practice', source: 'sample' },
  },
  {
    id: 'sample-2',
    emoji: '📋',
    title: 'Brand Redesign Case Study',
    description: 'Systems thinking applied to brand strategy',
    content: 'How a comprehensive brand system unifies identity and experience.',
    category: 'Projects',
    metadata: { type: 'case', source: 'sample' },
  },
];

function transformToPortfolioItems(notionContent: any) {
  const items: any[] = [];

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

  if (notionContent.cases && Array.isArray(notionContent.cases)) {
    notionContent.cases.forEach((caseItem: any, idx: number) => {
      items.push({
        id: `case-${idx}`,
        emoji: '📋',
        title: caseItem.title || 'Untitled Project',
        description: 'Project case study',
        content: caseItem.description || '',
        category: 'Projects',
        metadata: { type: 'case', url: caseItem.url },
      });
    });
  }

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

  if (notionContent.connections && Array.isArray(notionContent.connections)) {
    notionContent.connections.forEach((connection: any, idx: number) => {
      items.push({
        id: `connection-${idx}`,
        emoji: '🕸️',
        title: connection.title || 'Untitled Connection',
        description: 'Networked idea',
        content: connection.description || '',
        category: 'Thinking',
        metadata: { type: 'connection', url: connection.url },
      });
    });
  }

  return items;
}

router.get('/', async (req, res) => {
  try {
    if (portfolioCache && Date.now() - portfolioCache.timestamp < CACHE_TTL) {
      return res.json(portfolioCache.data);
    }

    let items: any[] = [];
    try {
      const notionContent = await scanNotionGarden();
      items = transformToPortfolioItems(notionContent);
    } catch (notionError) {
      console.warn('Notion fetch failed, using samples:', notionError);
      items = SAMPLE_PORTFOLIO_ITEMS;
    }

    if (!items || items.length === 0) {
      items = SAMPLE_PORTFOLIO_ITEMS;
    }

    items.sort((a, b) => a.category.localeCompare(b.category));

    const response = {
      items,
      total: items.length,
      categories: ['Projects', 'Thinking', 'Practices', 'Journey'],
      lastUpdated: new Date().toISOString(),
      source: items[0]?.metadata?.source === 'sample' ? 'sample' : 'notion',
    };

    portfolioCache = {
      data: response,
      timestamp: Date.now(),
    };

    return res.json(response);
  } catch (error) {
    console.error('Portfolio API error:', error);
    return res.status(200).json({
      items: SAMPLE_PORTFOLIO_ITEMS,
      total: SAMPLE_PORTFOLIO_ITEMS.length,
      categories: ['Projects', 'Thinking', 'Practices', 'Journey'],
      lastUpdated: new Date().toISOString(),
      source: 'sample',
    });
  }
});

router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const notionContent = await scanNotionGarden();
    const items = transformToPortfolioItems(notionContent);
    const filteredItems = items.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
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
