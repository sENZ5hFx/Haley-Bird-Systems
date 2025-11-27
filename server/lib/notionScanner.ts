/**
 * Notion Scanner - Pulls garden content and workspace data
 * 
 * Scans your Notion workspace for:
 * - Garden pages (Seeds, Saplings, Fruits)
 * - Project documentation
 * - Process notes
 * - Case studies
 * 
 * Returns organized content for room population
 */

import { Client } from '@notionhq/client';

interface GardenContent {
  seeds: any[];
  saplings: any[];
  fruits: any[];
  connections: any[];
}

interface RoomContent {
  statement?: string;
  practices?: any[];
  cases?: any[];
  journey?: any[];
  connections?: any[];
}

let cachedContent: { data: RoomContent; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Get Notion client with fresh token
 */
async function getNotionClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken || !hostname) {
    throw new Error('Notion connector not available');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=notion',
    {
      headers: {
        Accept: 'application/json',
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Notion not connected');
  }

  return new Client({ auth: accessToken });
}

/**
 * Scan all Notion pages in workspace
 */
async function scanWorkspace(notion: Client): Promise<any[]> {
  try {
    const response = await notion.search({
      query: '',
      filter: {
        value: 'page',
        property: 'object',
      },
      page_size: 100,
    });

    return response.results;
  } catch (error) {
    console.error('Error scanning workspace:', error);
    return [];
  }
}

/**
 * Extract text content from block
 */
async function extractBlockContent(notion: Client, blockId: string): Promise<string> {
  try {
    const block = await notion.blocks.retrieve({ block_id: blockId });
    if ('paragraph' in block) {
      return block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
    }
    if ('heading_1' in block) {
      return block.heading_1.rich_text.map((t: any) => t.plain_text).join('');
    }
    if ('heading_2' in block) {
      return block.heading_2.rich_text.map((t: any) => t.plain_text).join('');
    }
    if ('heading_3' in block) {
      return block.heading_3.rich_text.map((t: any) => t.plain_text).join('');
    }
    return '';
  } catch (error) {
    return '';
  }
}

/**
 * Get page content (first few blocks)
 */
async function getPageContent(notion: Client, pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 5,
    });

    const content = await Promise.all(
      response.results.map((block: any) => extractBlockContent(notion, block.id))
    );

    return content.filter((c) => c).join('\n');
  } catch (error) {
    return '';
  }
}

/**
 * Organize pages by database/structure
 * Now more inclusive - captures all pages and categorizes by keywords or defaults to "thinking"
 */
function organizeContent(pages: any[]): RoomContent {
  const content: RoomContent = {
    statement: 'Welcome to my thinking practice.',
    practices: [],
    cases: [],
    journey: [],
    connections: [],
  };

  pages.forEach((page: any) => {
    const title = page.properties?.title?.title?.[0]?.plain_text || 
                  page.properties?.Name?.title?.[0]?.plain_text || 
                  page.properties?.Title?.title?.[0]?.plain_text ||
                  'Untitled';
    const url = page.url || '';
    
    if (!title || title === 'Untitled' || title.length === 0) return; // Skip untitled/empty

    const lowerTitle = title.toLowerCase();

    // Categorize by keyword patterns
    if (lowerTitle.includes('practice') || lowerTitle.includes('ritual') || lowerTitle.includes('method')) {
      content.practices?.push({ title, url, type: 'practice', id: page.id });
    } else if (lowerTitle.includes('case') || lowerTitle.includes('project') || lowerTitle.includes('work') || lowerTitle.includes('study')) {
      content.cases?.push({ title, url, type: 'case', id: page.id });
    } else if (lowerTitle.includes('journey') || lowerTitle.includes('personal') || lowerTitle.includes('essay') || lowerTitle.includes('reflection')) {
      content.journey?.push({ title, url, type: 'entry', id: page.id });
    } else if (lowerTitle.includes('connection') || lowerTitle.includes('system') || lowerTitle.includes('network') || lowerTitle.includes('thinking')) {
      content.connections?.push({ title, url, type: 'connection', id: page.id });
    } else {
      // Default: add everything else as "thinking" content
      content.connections?.push({ title, url, type: 'connection', id: page.id });
    }
  });

  return content;
}

/**
 * Main export: Fetch and cache garden content
 */
export async function scanNotionGarden(): Promise<RoomContent> {
  // Check cache
  if (cachedContent && Date.now() - cachedContent.timestamp < CACHE_TTL) {
    return cachedContent.data;
  }

  try {
    const notion = await getNotionClient();
    const pages = await scanWorkspace(notion);
    const organized = organizeContent(pages);

    // Cache result
    cachedContent = {
      data: organized,
      timestamp: Date.now(),
    };

    return organized;
  } catch (error) {
    console.error('Failed to scan Notion garden:', error);
    // Return empty structure on failure
    return {
      statement: 'Welcome to my thinking practice.',
      practices: [],
      cases: [],
      journey: [],
      connections: [],
    };
  }
}

export type { RoomContent, GardenContent };
