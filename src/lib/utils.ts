import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR').format(val) + ' gp';
};

export const getItemIcon = (category: string) => {
  switch(category) {
    case 'armor': return '👕';
    case 'weapon': return '⚔️';
    case 'helmet': return '🪖';
    case 'shield': return '🛡️';
    case 'boots': return '👢';
    case 'legs': return '👖';
    case 'amulet': return '🧿';
    case 'ring': return '💍';
    default: return '📦';
  }
};
