/**
 * Room Metadata & Content Mapping
 * Defines what content lives in each room and how it's displayed
 */

import { SectionId } from '@/types';

export interface RoomMetadata {
  id: SectionId;
  label: string;
  description: string;
  notionPageId?: string;
  displayType: 'text' | 'gallery' | 'hybrid';
  contentSource: 'internal' | 'notion' | 'both';
  emoji: string;
}

export const ROOM_METADATA: Record<SectionId, RoomMetadata> = {
  'hero': {
    id: 'hero',
    label: 'Home',
    description: 'Entry point',
    displayType: 'text',
    contentSource: 'internal',
    emoji: '🏠',
  },
  'statement': {
    id: 'statement',
    label: 'Statement',
    description: 'Brand philosophy and approach',
    notionPageId: 'statement',
    displayType: 'text',
    contentSource: 'internal',
    emoji: '✨',
  },
  'portals': {
    id: 'portals',
    label: 'Portals',
    description: 'Audience-specific views',
    displayType: 'hybrid',
    contentSource: 'internal',
    emoji: '🔮',
  },
  'journey': {
    id: 'journey',
    label: 'Personal Journey',
    description: 'Vulnerable thinking and learning',
    displayType: 'text',
    contentSource: 'both',
    emoji: '🌱',
  },
  'garden': {
    id: 'garden',
    label: 'Digital Garden',
    description: 'Seeds, Saplings, Fruits network',
    notionPageId: 'garden',
    displayType: 'gallery',
    contentSource: 'notion',
    emoji: '🌿',
  },
  'practices': {
    id: 'practices',
    label: 'Practices',
    description: 'Core rituals and methodologies',
    displayType: 'text',
    contentSource: 'internal',
    emoji: '🔧',
  },
  'connections': {
    id: 'connections',
    label: 'Connections',
    description: 'Networked ideas visualization',
    displayType: 'hybrid',
    contentSource: 'internal',
    emoji: '🕸️',
  },
  'process': {
    id: 'process',
    label: 'Process',
    description: 'Behind-the-scenes thinking',
    notionPageId: 'process',
    displayType: 'text',
    contentSource: 'notion',
    emoji: '📝',
  },
  'cases': {
    id: 'cases',
    label: 'Case Studies',
    description: 'Projects and systems thinking',
    displayType: 'gallery',
    contentSource: 'both',
    emoji: '📋',
  },
  'rooms': {
    id: 'rooms',
    label: 'Rooms',
    description: 'Immersive zones',
    displayType: 'text',
    contentSource: 'internal',
    emoji: '🏛️',
  },
  'footer': {
    id: 'footer',
    label: 'Footer',
    description: 'Closing thoughts',
    displayType: 'text',
    contentSource: 'internal',
    emoji: '👋',
  },
};

/**
 * Map Notion workspace content to rooms
 * Structure: which Notion workspaces/pages go where
 */
export const NOTION_CONTENT_MAP = {
  'garden': {
    description: 'Digital Garden - Seeds/Saplings/Fruits from Notion',
    notionWorkspaces: ['Garden', 'Thinking'],
    displayFormat: 'card-grid',
  },
  'process': {
    description: 'Behind-the-work documentation',
    notionWorkspaces: ['Process', 'Learning'],
    displayFormat: 'timeline',
  },
  'cases': {
    description: 'Project case studies',
    notionWorkspaces: ['Projects', 'Work'],
    displayFormat: 'card-grid',
  },
  'journey': {
    description: 'Personal essays and reflections',
    notionWorkspaces: ['Journal', 'Personal'],
    displayFormat: 'card-list',
  },
};

/**
 * Get room metadata by ID
 */
export function getRoomMetadata(id: SectionId): RoomMetadata {
  return ROOM_METADATA[id] || ROOM_METADATA['hero'];
}

/**
 * Get all rooms in navigation order
 */
export function getRoomsInOrder(): SectionId[] {
  return [
    'statement',
    'portals',
    'journey',
    'garden',
    'practices',
    'connections',
    'process',
    'cases',
  ];
}

/**
 * Get next/previous room for sequential navigation
 */
export function getNextRoom(currentId: SectionId): SectionId | null {
  const rooms = getRoomsInOrder();
  const index = rooms.indexOf(currentId);
  return index < rooms.length - 1 ? rooms[index + 1] : null;
}

export function getPreviousRoom(currentId: SectionId): SectionId | null {
  const rooms = getRoomsInOrder();
  const index = rooms.indexOf(currentId);
  return index > 0 ? rooms[index - 1] : null;
}
