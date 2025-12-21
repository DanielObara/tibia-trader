import { useMemo, lazy, Suspense } from 'react';
import { Coins, TrendingUp, TrendingDown, ShoppingBag, History, ShieldAlert, Sparkles } from 'lucide-react';
import { useTransactions } from '../../../shared/context/TransactionContext';
import { formatCurrency } from '../../../lib/utils';
import { ProfitChart } from './ProfitChart';
import { ErrorBoundary } from '../../../shared/components/ErrorBoundary';

// Lazy load the remote component
// We use a feature flag to control if we even attempt to load it
const OracleAdvisor = lazy(() => import('oracle_advisor/OracleAdvisor')
	.then(module => {
		const Component = module.OracleAdvisor || module.default?.OracleAdvisor || module.default;
		if (!Component) throw new Error("Oracle component not found in remote exports");
		return { default: Component };
	})
	.catch(err => {
		console.error("Oracle Remote Error:", err);
		return {
			default: () => (
				<div className="bg-red-950/30 rounded-xl p-6 border border-red-500/20 flex items-center justify-center text-red-400 gap-2 h-32">
					<ShieldAlert size={20} />
					<span className="text-sm font-medium">Oráculo indisponível no momento.</span>
				</div>
			)
		};
	})
);

const FeatureFlagOracle = ({ transactions }: { transactions: any[] }) => {
	// Check for the feature flag (using string comparison because env vars are strings)
	const isEnabled = import.meta.env.VITE_ENABLE_ORACLE === 'true';
	console.log("Feature Flag Oracle:", { isEnabled, envValue: import.meta.env.VITE_ENABLE_ORACLE });

	if (!isEnabled) return null;

	return (
		<ErrorBoundary>
			<Suspense fallback={
				<div className="bg-slate-900 rounded-xl p-6 border border-purple-500/20 h-full flex items-center justify-center text-purple-400 animate-pulse">
					<Sparkles size={24} className="animate-spin mr-2" /> Carregando Oráculo...
				</div>
			}>
				<OracleAdvisor transactions={transactions} />
			</Suspense>
		</ErrorBoundary>
	);
};

export const DashboardStats = () => {
	const { transactions } = useTransactions();

	const stats = useMemo(() => {
		const totalProfit = transactions.reduce((acc, t) => acc + t.profit, 0);
		const totalLoss = transactions.filter(t => t.profit < 0).reduce((acc, t) => acc + Math.abs(t.profit), 0);
		const totalSales = transactions.reduce((acc, t) => acc + (t.npcPrice * t.quantity), 0);
		const totalItems = transactions.reduce((acc, t) => acc + t.quantity, 0);

		// Group by day for chart
		const last7Days = new Array(7).fill(0).map((_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const dateStr = d.toISOString().split('T')[0];
			const dayTransactions = transactions.filter(t => t.date === dateStr);

			return {
				date: dateStr,
				profit: dayTransactions.reduce((acc, t) => acc + t.profit, 0),
				rawDate: d
			};
		}).reverse();

		return { totalProfit, totalSales, totalItems, totalLoss, last7Days };
	}, [transactions]);

	return (
		<div className="space-y-6 pb-8">
			{/* KPI Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Lucro Líquido */}
				<div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
					<div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
						<Coins size={80} />
					</div>
					<p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Lucro Líquido (Profit)</p>
					<h3 className={`text-3xl font-bold mt-2 tracking-tight ${stats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
						{formatCurrency(stats.totalProfit)}
					</h3>
					<div className="mt-3 text-xs font-medium text-emerald-500/80 flex items-center gap-1 bg-emerald-500/10 w-fit px-2 py-1 rounded">
						<TrendingUp size={12} />
						<span>Balance Real</span>
					</div>
				</div>

				{/* Vendas Totais */}
				<div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-amber-500/30 transition-colors">
					<p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Volume de Vendas</p>
					<h3 className="text-3xl font-bold text-amber-400 mt-2 tracking-tight">{formatCurrency(stats.totalSales)}</h3>
					<div className="mt-3 text-xs font-medium text-amber-500/80 flex items-center gap-1 bg-amber-500/10 w-fit px-2 py-1 rounded">
						<ShoppingBag size={12} />
						<span>Bruto em NPCs</span>
					</div>
				</div>

				{/* Prejuízo */}
				<div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden hover:border-red-500/30 transition-colors">
					<div className="absolute right-0 top-0 p-4 opacity-5">
						<TrendingDown size={80} />
					</div>
					<p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Prejuízo (Waste)</p>
					<h3 className="text-3xl font-bold text-red-400 mt-2 tracking-tight">-{formatCurrency(stats.totalLoss)}</h3>
					<div className="mt-3 text-xs font-medium text-red-500/80 flex items-center gap-1 bg-red-500/10 w-fit px-2 py-1 rounded">
						<ShieldAlert size={12} />
						<span>Perdas Totais</span>
					</div>
				</div>

				{/* Itens */}
				<div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-blue-500/30 transition-colors">
					<p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Itens Negociados</p>
					<h3 className="text-3xl font-bold text-blue-400 mt-2 tracking-tight">{stats.totalItems}</h3>
					<div className="mt-3 text-xs font-medium text-blue-500/80 flex items-center gap-1 bg-blue-500/10 w-fit px-2 py-1 rounded">
						<History size={12} />
						<span>Transações</span>
					</div>
				</div>
			</div>

			{/* Charts & AI */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Simple Chart Visualization */}
				{/* Recharts Visualization */}
				<ProfitChart data={stats.last7Days} />

				{/* AI Advisor Column */}
				<div className="lg:col-span-1">
					<FeatureFlagOracle transactions={transactions} />
				</div>
			</div>
		</div>
	);
};
