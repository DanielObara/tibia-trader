import { useState } from 'react';
import { User, Sparkles, ShoppingBag } from 'lucide-react';
import { useTransactions } from '../../../shared/context/TransactionContext';
import { UserProfile } from '../../../shared/types';
import { formatCurrency } from '../../../lib/utils';

export const ProfileView = () => {
	const { transactions } = useTransactions();

	const [profile, setProfile] = useState<UserProfile>({
		name: 'Trader Elite',
		vocation: 'Royal Paladin',
		level: 350,
		world: 'Antica'
	});

	const totalProfit = transactions.reduce((acc, t) => acc + t.profit, 0);
	const bestItem = transactions.reduce((prev, current) => (prev.profit > current.profit) ? prev : current, transactions[0] || null);

	let rank = 'Mendigo de Thais';
	let rankColor = 'text-slate-400';
	if (totalProfit > 10000) { rank = 'Vendedor Ambulante'; rankColor = 'text-blue-400'; }
	if (totalProfit > 100000) { rank = 'Mercador de Venore'; rankColor = 'text-emerald-400'; }
	if (totalProfit > 1000000) { rank = 'Magnata do Server'; rankColor = 'text-amber-400'; }

	return (
		<div className="space-y-6 fade-in pb-12">
			<h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
				<User className="text-amber-500" />
				Perfil do Trader
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Card Principal */}
				<div className="col-span-1 md:col-span-2 bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

					<div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
						<div className="w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-2xl relative">
							<User size={56} className="text-slate-500" />
							<div className="absolute bottom-0 right-0 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full border border-slate-900">
								Lvl {profile.level}
							</div>
						</div>
						<div className="text-center sm:text-left space-y-3 flex-1">
							<h2 className="text-4xl font-bold text-white">{profile.name}</h2>
							<div className="flex flex-wrap justify-center sm:justify-start gap-3">
								<span className="bg-slate-900/50 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-amber-500 border border-slate-700">
									{profile.vocation}
								</span>
								<span className="bg-slate-900/50 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-emerald-500 border border-slate-700">
									{profile.world}
								</span>
							</div>
							<div className="pt-4 mt-2 border-t border-slate-700/50 flex flex-col sm:flex-row items-center gap-2">
								<span className="text-slate-400 text-sm font-semibold">Rank Atual:</span>
								<span className={`text-xl font-bold ${rankColor} drop-shadow-sm`}>{rank}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Estatísticas Rápidas */}
				<div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl flex flex-col justify-center space-y-6 relative overflow-hidden">
					{/* Background pattern */}
					<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>

					<div className="relative z-10">
						<div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
							<Sparkles size={14} className="text-amber-500" /> Melhor Negócio
						</div>
						{bestItem ? (
							<div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
								<div className="text-white font-bold truncate">{bestItem.itemName}</div>
								<div className="flex justify-between items-end mt-1">
									<div className="text-emerald-400 font-mono text-lg font-bold">+{formatCurrency(bestItem.profit)}</div>
									<div className="text-[10px] text-slate-500">{bestItem.date}</div>
								</div>
							</div>
						) : (
							<span className="text-slate-600 text-sm italic">Nenhum trade ainda...</span>
						)}
					</div>

					<div className="w-full h-px bg-slate-700/50 relative z-10"></div>

					<div className="relative z-10">
						<div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
							<ShoppingBag size={14} className="text-blue-500" /> NPC Favorito
						</div>
						<div className="text-white font-medium pl-1">Rashid</div>
						<div className="text-xs text-slate-500 pl-1 mt-1">Maior volume de vendas</div>
					</div>
				</div>
			</div>

			{/* Inputs de Perfil */}
			<div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg">
				<h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2">Configurações</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<div>
						<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome do Personagem</label>
						<input
							value={profile.name}
							onChange={(e) => setProfile({ ...profile, name: e.target.value })}
							className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
						/>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mundo</label>
						<input
							value={profile.world}
							onChange={(e) => setProfile({ ...profile, world: e.target.value })}
							className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
						/>
					</div>
					<div>
						<label className="block text-xs font-bold text-slate-500 uppercase mb-2">Level</label>
						<input
							type="number"
							value={profile.level}
							onChange={(e) => setProfile({ ...profile, level: parseInt(e.target.value) || 0 })}
							className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
