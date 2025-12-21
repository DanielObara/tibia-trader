export type NpcName = 'Rashid' | 'Blue Djinn' | 'Green Djinn';

export interface Item {
  id: string;
  name: string;
  npc: NpcName;
  price: number; // NPC Buy Price
  category: 'armor' | 'weapon' | 'helmet' | 'shield' | 'boots' | 'legs' | 'amulet' | 'ring' | 'other';
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  npc: NpcName;
  npcPrice: number;
  buyPrice: number; // Price paid by player
  quantity: number;
  profit: number;
  date: string; // ISO Date YYYY-MM-DD
  timestamp: number;
}

export interface UserProfile {
  name: string;
  vocation: string;
  level: number;
  world: string;
}
