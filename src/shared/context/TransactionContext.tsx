import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Transaction } from '../types';
import { LocalStorageRepository } from '../../core/services/storage';

interface TransactionContextType {
	transactions: Transaction[];
	addTransaction: (t: Omit<Transaction, 'id' | 'date' | 'timestamp'>) => void;
	removeTransaction: (id: string) => void;
	loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Initial load
		const data = LocalStorageRepository.getAll();
		setTransactions(data);
		setLoading(false);
	}, []);

	const addTransaction = (t: Omit<Transaction, 'id' | 'date' | 'timestamp'>) => {
		const newTransaction: Transaction = {
			...t,
			id: Math.random().toString(36).substr(2, 9),
			date: new Date().toISOString().split('T')[0],
			timestamp: Date.now(),
		};

		// Optimistic update
		setTransactions(prev => [newTransaction, ...prev]);
		LocalStorageRepository.save(newTransaction);
	};

	const removeTransaction = (id: string) => {
		setTransactions(prev => prev.filter(t => t.id !== id));
		LocalStorageRepository.delete(id);
	};

	return (
		<TransactionContext.Provider value={{ transactions, addTransaction, removeTransaction, loading }}>
			{children}
		</TransactionContext.Provider>
	);
};

export const useTransactions = () => {
	const context = useContext(TransactionContext);
	if (!context) {
		throw new Error('useTransactions must be used within a TransactionProvider');
	}
	return context;
};
