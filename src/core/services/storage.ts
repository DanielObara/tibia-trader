import { Transaction } from "../../shared/types";

export interface TransactionRepository {
  getAll(): Transaction[];
  save(transaction: Transaction): void;
  delete(id: string): void;
  clear(): void;
}

const STORAGE_KEY = 'tibia-transactions-v2';

export const LocalStorageRepository: TransactionRepository = {
  getAll: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load transactions", e);
      return [];
    }
  },

  save: (transaction: Transaction) => {
    const current = LocalStorageRepository.getAll();
    const updated = [transaction, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  delete: (id: string) => {
    const current = LocalStorageRepository.getAll();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
