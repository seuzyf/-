export enum ArcanaType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR'
}

export interface TarotCardData {
  id: number;
  name: string;
  nameEn: string;
  image: string; // Placeholder URL
}

export interface SelectedCard extends TarotCardData {
  position: 'past' | 'present' | 'future';
  isReversed: boolean;
  isRevealed: boolean;
}

export type GameState = 'input' | 'shuffling' | 'picking' | 'reading';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  alpha: number;
}
