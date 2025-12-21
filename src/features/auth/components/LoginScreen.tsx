import { Coins } from 'lucide-react';

interface LoginScreenProps {
	onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => (
	<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-[url('https://www.tibiawiki.com.br/images/e/e0/Tibia_Map.jpg')] bg-cover bg-center bg-no-repeat bg-blend-multiply">
		<div className="bg-slate-900/90 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full border border-slate-700 relative overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

			<div className="flex justify-center mb-6">
				<div className="bg-slate-800 p-4 rounded-full border border-amber-500/30 shadow-lg shadow-amber-500/10">
					<Coins className="w-12 h-12 text-amber-500" />
				</div>
			</div>

			<h1 className="text-3xl font-bold text-center text-slate-100 mb-2 font-serif tracking-wide">TibiaMarket SaaS</h1>
			<p className="text-slate-400 text-center mb-8">Ferramenta profissional para Traders de Tibia.</p>

			<form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-5">
				<div>
					<label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
					<input
						type="email"
						defaultValue="trader@tibia.com.br"
						className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
					/>
				</div>
				<div>
					<label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Senha</label>
					<input
						type="password"
						defaultValue="password"
						className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-3.5 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-black/40"
				>
					Acessar Painel
				</button>
			</form>
			<div className="mt-6 text-center text-[10px] text-slate-600 uppercase tracking-widest">
				Sistema Seguro v2.4 • Feito por Traders
			</div>
		</div>
	</div>
);
