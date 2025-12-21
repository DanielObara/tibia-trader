import { useState, useEffect } from 'react';
import {
	LayoutDashboard,
	ShoppingBag,
	History,
	User,
	LogOut,
	Coins
} from 'lucide-react';

import { LoginScreen } from './features/auth/components/LoginScreen';
import { DashboardStats } from './features/dashboard/components/DashboardStats';
import { MarketTable } from './features/transactions/components/MarketTable';
import { ProfileView } from './features/profile/components/ProfileView';
import { NpcName } from './shared/types';
import { useTransactions } from './shared/context/TransactionContext';

export const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentView, setCurrentView] = useState<'dashboard' | 'market' | 'history' | 'profile'>('dashboard');
	const [activeNpc, setActiveNpc] = useState<NpcName>('Rashid');

	// We can use the context merely to check if we are loading, but for auth we use local state/localStorage as before
	useEffect(() => {
		const auth = localStorage.getItem('tibia-auth');
		if (auth === 'true') setIsAuthenticated(true);
	}, []);

	const handleLogin = () => {
		setIsAuthenticated(true);
		localStorage.setItem('tibia-auth', 'true');
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		localStorage.removeItem('tibia-auth');
		setCurrentView('dashboard');
	};

	if (!isAuthenticated) {
		return <LoginScreen onLogin={handleLogin} />;
	}

	return (
		<div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-white">
			{/* Sidebar Navigation */}
			<nav className="fixed bottom-0 w-full md:w-20 lg:w-64 md:h-screen md:top-0 md:left-0 bg-slate-900 border-t md:border-r md:border-t-0 border-slate-800 z-50 flex flex-col shadow-2xl transition-all duration-300">
				<div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-800/80 h-20">
					<div className="bg-amber-500/10 p-2 rounded-lg">
						<Coins size={24} className="text-amber-500" />
					</div>
					<div className="hidden lg:block">
						<span className="text-lg font-bold tracking-tight text-white block leading-tight">TibiaMarket</span>
						<span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">SaaS Pro</span>
					</div>
				</div>

				<div className="flex-1 flex md:flex-col justify-around md:justify-start gap-1 md:gap-2 p-2 md:p-4 overflow-y-auto">
					{[
						{ id: 'dashboard', icon: LayoutDashboard, label: 'Painel Geral' },
						{ id: 'market', icon: ShoppingBag, label: 'Mercado NPC' },
						{ id: 'history', icon: History, label: 'Histórico' },
						{ id: 'profile', icon: User, label: 'Perfil Trader' }
					].map((item) => (
						<button
							key={item.id}
							onClick={() => setCurrentView(item.id as any)}
							className={`flex items-center gap-3 p-3.5 rounded-xl transition-all group relative overflow-hidden ${currentView === item.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
						>
							<item.icon size={22} className={`${currentView === item.id ? 'animate-pulse' : ''} group-hover:scale-110 transition-transform`} />
							<span className="hidden lg:inline font-medium text-sm">{item.label}</span>
							{currentView === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-full"></div>}
						</button>
					))}
				</div>

				<div className="hidden md:block p-4 border-t border-slate-800/80">
					<button
						onClick={handleLogout}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 w-full transition-colors group"
					>
						<LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
						<span className="hidden lg:inline font-medium text-sm">Sair do Sistema</span>
					</button>
				</div>
			</nav>

			{/* Main Content */}
			<main className="md:pl-20 lg:pl-64 w-full min-h-screen transition-all duration-300">
				<div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">

					{/* Mobile Header */}
					<header className="md:hidden flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
						<div className="flex items-center gap-2">
							<div className="bg-amber-500/10 p-1.5 rounded-lg">
								<Coins size={20} className="text-amber-500" />
							</div>
							<span className="text-lg font-bold text-white">TibiaMarket</span>
						</div>
						<button onClick={handleLogout} className="text-slate-400 p-2 active:bg-slate-800 rounded">
							<LogOut size={20} />
						</button>
					</header>

					{/* View Container */}
					<div className="min-h-[85vh]">
						{currentView === 'dashboard' && (
							<div className="space-y-8 fade-in">
								<div className="flex flex-col gap-1 border-l-4 border-amber-500 pl-4 py-1">
									<h1 className="text-3xl font-bold text-white tracking-tight">Painel de Controle</h1>
									<p className="text-slate-400 text-sm">Resumo financeiro das suas atividades de trade.</p>
								</div>
								<DashboardStats />
							</div>
						)}

						{currentView === 'market' && (
							<div className="space-y-6 fade-in">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
									<div className="flex flex-col gap-1 border-l-4 border-blue-500 pl-4 py-1">
										<h1 className="text-3xl font-bold text-white tracking-tight">Mercado NPC</h1>
										<p className="text-slate-400 text-sm">Registre suas compras e calcule o lucro exato.</p>
									</div>

									<div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
										{(['Rashid', 'Blue Djinn', 'Green Djinn'] as NpcName[]).map(npc => (
											<button
												key={npc}
												onClick={() => setActiveNpc(npc)}
												className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeNpc === npc ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
											>
												{npc}
											</button>
										))}
									</div>
								</div>
								<MarketTable npc={activeNpc} />
							</div>
						)}

						{currentView === 'history' && (
							<div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 fade-in">
								<History size={64} className="mb-4 opacity-20" />
								<h2 className="text-2xl font-bold text-slate-400 mb-2">Histórico Completo</h2>
								<p>Esta funcionalidade estará disponível na próxima atualização.</p>
								<p className="text-xs text-slate-600 mt-2">Dica: Veja os últimos 7 dias no Painel.</p>
							</div>
						)}

						{currentView === 'profile' && <ProfileView />}
					</div>
				</div>
			</main>
		</div>
	);
};
