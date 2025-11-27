/**
 * Link Resolver - Intelligent internal linking and routing
 * Handles navigation between rooms, pages, and back links
 */

import { SectionId } from '../types';

export interface RouteLink {
  target: SectionId;
  label: string;
  breadcrumb?: string[];
}

export interface LinkPart {
  type: 'text' | 'link';
  content: string;
  target?: SectionId;
}

// Map of all available rooms/sections
export const ROOM_MAP: Record<string, SectionId> = {
  'hero': 'hero',
  'statement': 'statement',
  'portals': 'portals',
  'journey': 'journey',
  'garden': 'garden',
  'practices': 'practices',
  'connections': 'connections',
  'process': 'process',
  'cases': 'cases',
  'portfolio': 'cases',
  'work': 'cases',
  'projects': 'cases',
  'rooms': 'rooms',
  'footer': 'footer',
};

// Breadcrumb trails (forward + back links)
export const BREADCRUMB_STRUCTURE: Record<SectionId, { label: string; parent?: SectionId; children?: SectionId[] }> = {
  'hero': { label: 'Home' },
  'statement': { label: 'Philosophy', parent: 'hero', children: ['portals', 'practices'] },
  'portals': { label: 'Perspectives', parent: 'statement', children: ['journey', 'garden'] },
  'journey': { label: 'Personal Journey', parent: 'portals', children: ['connections'] },
  'garden': { label: 'Digital Garden', parent: 'statement', children: ['practices', 'connections'] },
  'practices': { label: 'Practices', parent: 'statement', children: ['cases', 'connections'] },
  'connections': { label: 'Connections', parent: 'garden', children: ['process', 'cases'] },
  'process': { label: 'Process', parent: 'connections', children: ['cases'] },
  'cases': { label: 'Case Studies', parent: 'practices', children: [] },
  'rooms': { label: 'Rooms', parent: 'hero' },
  'footer': { label: 'Footer' },
};

/**
 * Resolve a link string to a room ID
 */
export function resolveLink(linkString: string): SectionId | null {
  const normalized = linkString.toLowerCase().trim().replace(/[#\s]/g, '');
  return ROOM_MAP[normalized] || null;
}

/**
 * Get breadcrumb trail for a room
 */
export function getBreadcrumbTrail(roomId: SectionId): SectionId[] {
  const trail: SectionId[] = [roomId];
  let current = roomId;

  while (BREADCRUMB_STRUCTURE[current]?.parent) {
    current = BREADCRUMB_STRUCTURE[current].parent!;
    trail.unshift(current);
  }

  return trail;
}

/**
 * Get back link for a room
 */
export function getBackLink(roomId: SectionId): SectionId | null {
  return BREADCRUMB_STRUCTURE[roomId]?.parent || null;
}

/**
 * Get child/related links
 */
export function getRelatedLinks(roomId: SectionId): SectionId[] {
  return BREADCRUMB_STRUCTURE[roomId]?.children || [];
}

/**
 * Parse internal links from text
 * Looks for patterns like [[room-name]] or #room-name
 */
export function extractLinksFromText(text: string): RouteLink[] {
  const links: RouteLink[] = [];

  // Match [[room-name]] pattern
  const bracketPattern = /\[\[([^\]]+)\]\]/g;
  let match;

  while ((match = bracketPattern.exec(text)) !== null) {
    const target = resolveLink(match[1]);
    if (target) {
      links.push({
        target,
        label: match[1],
      });
    }
  }

  // Match #room-name pattern
  const hashPattern = /#([a-z-]+)/g;
  while ((match = hashPattern.exec(text)) !== null) {
    const target = resolveLink(match[1]);
    if (target && !links.some(l => l.target === target)) {
      links.push({
        target,
        label: match[1],
      });
    }
  }

  return links;
}

/**
 * Parse text into parts (text and links)
 * Returns data structure for React components to render
 */
export function parseTextLinks(text: string): LinkPart[] {
  const parts: LinkPart[] = [];
  let lastIndex = 0;

  const bracketPattern = /\[\[([^\]]+)\]\]/g;
  let match;

  while ((match = bracketPattern.exec(text)) !== null) {
    const target = resolveLink(match[1]);

    // Add text before link
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }

    if (target) {
      parts.push({
        type: 'link',
        content: match[1],
        target,
      });
    }

    lastIndex = bracketPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return parts;
}
