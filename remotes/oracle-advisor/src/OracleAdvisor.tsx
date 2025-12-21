import { useState } from 'react';
import { Sparkles, Gem } from 'lucide-react';

// Copied type definition to allow independence
export interface Transaction {
	id: string;
	itemName: string;
	npc: string;
	buyPrice: number;
	npcPrice: number;
	profit: number;
	date: string;
}

export const OracleAdvisor = ({ transactions }: { transactions: Transaction[] }) => {
	const [advice, setAdvice] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const getAdvice = async () => {
		setLoading(true);

		// Simulate network delay
		setTimeout(() => {
			const msgs = [
				"Compre na baixa, venda na alta! Mas cuidado com os PKs...",
				"Os Djinns estão pagando bem por itens de ankrahmun hoje.",
				"Evite carregar muito gold, use o banco!",
				"Farme imbuement items, o preço está subindo!",
				"Rashid está em Carlin hoje? Verifique antes de viajar.",
				"Seu profit está bom, mas poderia ser melhor se caçasse monstros mais fortes."
			];
			const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
			setAdvice(randomMsg);
			setLoading(false);
		}, 1500);
	};

	return (
		<div className="bg-gradient-to-br from-purple-950/80 to-slate-900 rounded-xl p-6 border border-purple-500/30 shadow-lg relative overflow-hidden group">
			{/* Decorative BG */}
			<div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>

			<div className="relative z-10">
				<h3 className="text-xl font-bold text-purple-300 flex items-center gap-2 mb-2">
					<Gem className="w-5 h-5 text-purple-400" /> Oráculo Goblin (Visual Only)
				</h3>
				<p className="text-purple-200/60 text-sm mb-5 leading-relaxed">
					Use inteligência arcana para analisar seus trades e encontrar oportunidades de profit.
				</p>

				{advice && (
					<div className="bg-slate-950/80 p-4 rounded-lg border-l-4 border-purple-500 mb-5 italic text-purple-100 text-sm shadow-inner animate-in fade-in zoom-in-95 duration-300">
						"{advice}"
					</div>
				)}

				<button
					onClick={getAdvice}
					disabled={loading}
					className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-lg border border-purple-500/20"
				>
					{loading ? (
						<span className="flex items-center gap-2"><Sparkles className="animate-spin" size={16} /> Consultando Espíritos...</span>
					) : (
						<>
							<Sparkles size={16} /> Pedir Conselho
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default OracleAdvisor;
