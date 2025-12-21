import { useState, useMemo } from 'react';
import { Search, Save, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { NpcName } from '../../../shared/types';
import { MOCK_ITEMS } from '../../market/data';
import { useTransactions } from '../../../shared/context/TransactionContext'; // Fixed import path
import { getItemIcon } from '../../../lib/utils';

interface MarketTableProps {
	npc: NpcName;
}

export const MarketTable = ({ npc }: MarketTableProps) => {
	const { addTransaction } = useTransactions();
	const items = useMemo(() => MOCK_ITEMS.filter(i => i.npc === npc), [npc]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const categories = useMemo(() => {
		const cats = Array.from(new Set(items.map(i => i.category)));
		return ['all', ...cats.sort()];
	}, [items]);

	const [inputs, setInputs] = useState<Record<string, { buyPrice: string; quantity: string }>>({});

	const handleInputChange = (id: string, field: 'buyPrice' | 'quantity', value: string) => {
		setInputs(prev => ({
			...prev,
			[id]: { ...prev[id], [field]: value }
		}));
	};

	const getValues = (id: string) => {
		return inputs[id] || { buyPrice: '', quantity: '1' };
	};

	const filteredItems = items.filter(i => {
		const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'all' || i.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[75vh]">
			{/* Header com Busca */}
			<div className="p-5 border-b border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-850">
				<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-1">
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
						<input
							type="text"
							placeholder="Buscar item..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
						/>
					</div>
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all capitalize"
					>
						<option value="all">Todas as Categorias</option>
						{categories.filter(c => c !== 'all').map(c => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
				</div>
				<div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
					{filteredItems.length} Itens de {npc}
				</div>
			</div>

			<div className="overflow-y-auto flex-1 custom-scrollbar">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs tracking-wider sticky top-0 z-10 shadow-sm">
						<tr>
							<th className="p-4 bg-slate-900">Item</th>
							<th className="p-4 bg-slate-900 text-right hidden md:table-cell">Preço NPC</th> {/* Hidden on mobile */}
							<th className="p-4 bg-slate-900 text-right">Compra / Qtd</th>
							<th className="p-4 bg-slate-900 text-right hidden sm:table-cell">Resultado</th> {/* Hidden on tiny screens */}
							<th className="p-4 bg-slate-900 text-center">Ação</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-700/50">
						{filteredItems.map(item => {
							const vals = getValues(item.id);
							const buyPrice = parseInt(vals.buyPrice) || 0;
							const quantity = parseInt(vals.quantity) || 1;
							const profitPerItem = item.price - buyPrice;
							const totalProfit = profitPerItem * quantity;
							const margin = buyPrice > 0 ? ((item.price - buyPrice) / buyPrice) * 100 : 0;

							const isProfitable = profitPerItem > 0;
							const isLoss = profitPerItem < 0;

							return (
								<tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
									<td className="p-3 sm:p-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-900 rounded-lg text-lg border border-slate-700 group-hover:border-slate-500 transition-colors shadow-sm">
												{getItemIcon(item.category)}
											</div>
											<div className="min-w-0">
												<div className="font-bold text-slate-200 truncate pr-2">{item.name}</div>
												<div className="text-xs text-slate-500 md:hidden mt-0.5">NPC: {item.price.toLocaleString()}</div>
												{/* Show profit on mobile since Resultado column is hidden */}
												<div className="sm:hidden mt-1 font-mono font-bold text-xs">
													{buyPrice > 0 ? (
														<span className={isProfitable ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-slate-500'}>
															{totalProfit > 0 ? '+' : ''}{totalProfit.toLocaleString()}
														</span>
													) : <span className="text-slate-600">-</span>}
												</div>
											</div>
										</div>
									</td>
									<td className="p-4 text-right font-mono text-amber-400 font-medium hidden md:table-cell">
										{item.price.toLocaleString()}
									</td>
									<td className="p-3 sm:p-4 text-right">
										<div className="flex flex-col items-end gap-2">
											<div className="relative">
												<span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">GP</span>
												<input
													type="number"
													placeholder="0"
													className="w-20 sm:w-28 bg-slate-950 border border-slate-600 rounded px-2 pl-6 py-1.5 text-right focus:border-amber-500 outline-none text-white text-sm transition-colors"
													value={vals.buyPrice}
													onChange={(e) => handleInputChange(item.id, 'buyPrice', e.target.value)}
												/>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-[10px] text-slate-500 uppercase">Qtd</span>
												<input
													type="number"
													min="1"
													className="w-12 sm:w-16 bg-slate-950 border border-slate-600 rounded px-2 py-1 text-right focus:border-amber-500 outline-none text-slate-300 text-xs"
													value={vals.quantity}
													onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
												/>
											</div>
										</div>
									</td>
									<td className="p-4 text-right hidden sm:table-cell">
										<div className="flex flex-col items-end justify-center h-full">
											<div className={`font-mono font-bold text-base ${isProfitable ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-slate-500'}`}>
												{buyPrice > 0 ? (totalProfit > 0 ? '+' : '') + totalProfit.toLocaleString() : '-'}
											</div>
											{buyPrice > 0 && (
												<span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold mt-1 ${isProfitable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
													isLoss ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-700 text-slate-400'
													}`}>
													{isProfitable ? <ArrowUpRight size={10} /> : isLoss ? <ArrowDownRight size={10} /> : null}
													{Math.round(margin)}%
												</span>
											)}
										</div>
									</td>
									<td className="p-3 sm:p-4 text-center">
										<button
											disabled={!buyPrice || quantity < 1}
											onClick={() => {
												addTransaction({
													itemId: item.id,
													itemName: item.name,
													npc: item.npc,
													npcPrice: item.price,
													buyPrice,
													quantity,
													profit: totalProfit
												});
												// Clear inputs after save
												setInputs(prev => {
													const newInputs = { ...prev };
													delete newInputs[item.id];
													return newInputs;
												});
											}}
											className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 sm:p-2.5 rounded-lg transition-all shadow-lg shadow-amber-900/20 active:scale-95 group/btn"
											title="Registrar Venda"
										>
											<Save size={18} className="group-hover/btn:scale-110 transition-transform" />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				{filteredItems.length === 0 && (
					<div className="p-12 text-center text-slate-500">
						Nenhum loot encontrado com esse nome.
					</div>
				)}
			</div>
		</div>
	);
};
