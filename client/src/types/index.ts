/**
 * Core type definitions for the room-based navigation system.
 * All sections map to SectionId to ensure type-safe routing.
 */

export type SectionId = 
  | 'hero'
  | 'statement'
  | 'portals'
  | 'journey'
  | 'garden'
  | 'practices'
  | 'connections'
  | 'process'
  | 'cases'
  | 'rooms'
  | 'footer';

/**
 * Visual/sensory profile for each room.
 * Maps section to its ambient mood (colors, light, particles, sound).
 */
export interface RoomProfile {
  id: SectionId;
  label: string;
  color: string;
  lightIntensity: number;
  particleIntensity: number;
  soundFreq?: number;
}
