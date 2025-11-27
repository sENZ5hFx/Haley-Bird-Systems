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
 * GET /api/portfolio - Fetch all portfolio items
 */
router.get('/', async (req, res) => {
  try {
    // Check cache
    if (portfolioCache && Date.now() - portfolioCache.timestamp < CACHE_TTL) {
      return res.json(portfolioCache.data);
    }

    // Fetch from Notion
    const notionContent = await scanNotionGarden();
    const items = transformToPortfolioItems(notionContent);

    // Sort by category for better grouping
    items.sort((a, b) => a.category.localeCompare(b.category));

    const response = {
      items,
      total: items.length,
      categories: ['Projects', 'Thinking', 'Practices', 'Journey'],
      lastUpdated: new Date().toISOString(),
    };

    // Cache the response
    portfolioCache = {
      data: response,
      timestamp: Date.now(),
    };

    return res.json(response);
  } catch (error) {
    console.error('Portfolio API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch portfolio',
      items: [],
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
