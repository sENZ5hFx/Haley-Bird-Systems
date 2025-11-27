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
  'portfolio': 'cases', // portfolio maps to cases
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
 * Convert text links to clickable format
 */
export function linkifyText(text: string, onLinkClick: (roomId: SectionId) => void): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const bracketPattern = /\[\[([^\]]+)\]\]/g;
  let match;

  while ((match = bracketPattern.exec(text)) !== null) {
    const target = resolveLink(match[1]);

    // Add text before link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (target) {
      parts.push(
        <button
          key={`link-${match.index}`}
          onClick={() => onLinkClick(target)}
          className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
        >
          {match[1]}
        </button>
      );
    }

    lastIndex = bracketPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
