/**
 * Universal Content Processor - Intelligent content extraction from Notion
 * 
 * Single source of truth architecture:
 * - Pull content from Notion
 * - Detect content type (essay, book, linked pages, images, etc.)
 * - Format intelligently based on type
 * - Never require double work
 */

import { Client } from '@notionhq/client';

export interface ProcessedContent {
  id: string;
  title: string;
  type: 'essay' | 'book' | 'collection' | 'network' | 'image-gallery' | 'timeline' | 'practice' | 'case-study' | 'reflection';
  body: string;
  excerpt: string;
  metadata: {
    tags?: string[];
    stage?: 'seed' | 'sapling' | 'fruit';
    audience?: string[];
    linkedPages?: any[];
    images?: string[];
    relatedItems?: any[];
  };
  displayFormat: 'long-form' | 'paginated' | 'interactive-network' | 'flipbook' | 'card' | 'timeline';
  raw: any;
}

/**
 * Detect content type from Notion page properties and structure
 */
export async function detectContentType(
  notion: Client,
  page: any
): Promise<string> {
  try {
    const title = (page.properties?.title?.title?.[0]?.plain_text || '').toLowerCase();
    const hasLinkedPages = page.properties?.Relations || page.properties?.Linked || false;
    const hasMultipleVersions = page.properties?.Versions || page.properties?.Alternatives || false;

    // Book detection
    if (title.includes('book') || title.includes('transmission') || hasMultipleVersions) {
      return 'book';
    }

    // Practice/methodology
    if (title.includes('practice') || title.includes('ritual') || title.includes('method')) {
      return 'practice';
    }

    // Case study
    if (
      title.includes('case') ||
      title.includes('project') ||
      title.includes('study') ||
      title.includes('work')
    ) {
      return 'case-study';
    }

    // Journey/reflection
    if (
      title.includes('journey') ||
      title.includes('personal') ||
      title.includes('essay') ||
      title.includes('reflection') ||
      title.includes('thinking')
    ) {
      return 'reflection';
    }

    // Network/connections
    if (title.includes('connection') || title.includes('system') || title.includes('network')) {
      return 'network';
    }

    // Default to essay
    return 'essay';
  } catch (error) {
    return 'essay';
  }
}

/**
 * Intelligently extract content blocks and relationships
 */
export async function extractRichContent(
  notion: Client,
  pageId: string,
  maxDepth: number = 3
): Promise<{
  body: string;
  images: string[];
  linkedPages: any[];
  metadata: any;
}> {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    let body = '';
    const images: string[] = [];
    const linkedPages: any[] = [];
    const metadata: any = {};

    for (const block of blocks.results) {
      if ('paragraph' in block && block.paragraph) {
        const text = block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
        if (text) body += text + '\n';
      }

      if ('heading_1' in block && block.heading_1) {
        const text = block.heading_1.rich_text.map((t: any) => t.plain_text).join('');
        if (text) body += `\n# ${text}\n`;
      }

      if ('heading_2' in block && block.heading_2) {
        const text = block.heading_2.rich_text.map((t: any) => t.plain_text).join('');
        if (text) body += `\n## ${text}\n`;
      }

      if ('image' in block && block.image) {
        const url = block.image.type === 'external' ? block.image.external?.url : block.image.file?.url;
        if (url) images.push(url);
      }

      if ('relation' in block && block.relation && maxDepth > 0) {
        linkedPages.push(...block.relation);
      }

      if ('database' in block && block.database) {
        metadata.hasDatabase = true;
      }
    }

    return {
      body: body.trim(),
      images,
      linkedPages,
      metadata,
    };
  } catch (error) {
    console.error('Error extracting rich content:', error);
    return { body: '', images: [], linkedPages: [], metadata: {} };
  }
}

/**
 * Determine best display format based on content type and structure
 */
export function determineDisplayFormat(
  contentType: string,
  content: any
): string {
  if (contentType === 'book') return 'flipbook';
  if (contentType === 'network') return 'interactive-network';
  if (contentType === 'practice') return 'card';
  if (contentType === 'case-study') return 'timeline';
  if (content.images?.length > 0) return 'card';
  if (content.body?.length > 5000) return 'paginated';
  if (content.linkedPages?.length > 2) return 'interactive-network';
  return 'long-form';
}

/**
 * Create excerpt from body (intelligent truncation)
 */
export function createExcerpt(body: string, maxLength: number = 200): string {
  if (!body) return '';
  // Find first sentence or paragraph
  const sentences = body.split(/[.!?]+/);
  let excerpt = sentences[0]?.trim() || '';

  if (excerpt.length < maxLength && sentences[1]) {
    excerpt = (excerpt + '. ' + sentences[1]?.trim()).substring(0, maxLength);
  }

  return excerpt.length > 0 ? excerpt + '…' : body.substring(0, maxLength) + '…';
}

/**
 * Process Notion page into structured content
 * MAIN ENTRY POINT - handles all content intelligently
 */
export async function processNotionPage(
  notion: Client,
  page: any
): Promise<ProcessedContent | null> {
  try {
    const title =
      page.properties?.title?.title?.[0]?.plain_text ||
      page.properties?.Name?.title?.[0]?.plain_text ||
      page.properties?.Title?.title?.[0]?.plain_text ||
      'Untitled';

    if (!title || title === 'Untitled') return null;

    // Detect type
    const contentType = await detectContentType(notion, page);

    // Extract rich content
    const richContent = await extractRichContent(notion, page.id);

    // Determine display format
    const displayFormat = determineDisplayFormat(contentType, richContent);

    // Create excerpt
    const excerpt = createExcerpt(richContent.body);

    // Extract metadata
    const metadata: any = {
      tags: page.properties?.Tags?.multi_select?.map((t: any) => t.name) || [],
      stage:
        page.properties?.Stage?.select?.name?.toLowerCase() || 'sapling',
      audience: page.properties?.Audience?.multi_select?.map((a: any) => a.name) || [],
      linkedPages: richContent.linkedPages,
      images: richContent.images,
      relatedItems: [],
    };

    return {
      id: page.id,
      title,
      type: contentType as any,
      body: richContent.body,
      excerpt,
      metadata,
      displayFormat: displayFormat as any,
      raw: page,
    };
  } catch (error) {
    console.error('Error processing Notion page:', error);
    return null;
  }
}

/**
 * Process multiple pages intelligently
 */
export async function processNotionPages(
  notion: Client,
  pages: any[]
): Promise<ProcessedContent[]> {
  const processed: ProcessedContent[] = [];

  for (const page of pages) {
    const content = await processNotionPage(notion, page);
    if (content) {
      processed.push(content);
    }
  }

  return processed;
}

/**
 * Special handler for "The Broken Transmission" - multi-perspective book
 * Detects multiple versions and prepares them for flipbook display
 */
export async function extractBookVersions(
  notion: Client,
  bookPageId: string
): Promise<Array<{ version: string; content: string; perspective: string }>> {
  try {
    const versions = [];

    // Try to find related pages labeled as different versions
    const page = await notion.pages.retrieve({ page_id: bookPageId });
    const richContent = await extractRichContent(notion, bookPageId, 2);

    // Main version
    versions.push({
      version: 'original',
      content: richContent.body,
      perspective: 'Read normally',
    });

    // Check for alternate/flipped versions
    if (richContent.metadata.hasDatabase) {
      // Could contain multiple versions
      versions.push({
        version: 'flipped',
        content: richContent.body, // In UI, this would be rotated 180deg
        perspective: 'Read upside down',
      });
    }

    return versions;
  } catch (error) {
    console.error('Error extracting book versions:', error);
    return [];
  }
}

export type { ProcessedContent };
