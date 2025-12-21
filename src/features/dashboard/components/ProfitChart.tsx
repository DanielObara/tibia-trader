import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts';
import { formatCurrency } from '../../../lib/utils';
import { TrendingUp } from 'lucide-react';

interface ChartData {
	date: string;
	profit: number;
	rawDate: Date;
}

interface ProfitChartProps {
	data: ChartData[];
}

export const ProfitChart = ({ data }: ProfitChartProps) => {
	return (
		<div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col h-96 lg:col-span-2">
			<div className="flex justify-between items-center mb-6">
				<h4 className="text-slate-200 font-bold flex items-center gap-2">
					<TrendingUp className="text-emerald-500" size={20} />
					Performance Financeira
				</h4>
				<div className="text-xs text-slate-500 font-medium bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
					Últimos 7 dias
				</div>
			</div>

			<div className="flex-1 w-full min-h-0">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
						<XAxis
							dataKey="date"
							tickFormatter={(val) => `${val.slice(8)}/${val.slice(5, 7)}`} // DD/MM
							axisLine={false}
							tickLine={false}
							tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
							dy={10}
						/>
						<YAxis
							tick={{ fill: '#64748b', fontSize: 10 }}
							axisLine={false}
							tickLine={false}
							tickFormatter={(val) => `${val / 1000}k`}
						/>
						<Tooltip
							cursor={{ fill: '#1e293b' }}
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									const val = payload[0].value as number;
									return (
										<div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs">
											<div className="text-slate-400 mb-1">Lucro do Dia</div>
											<div className={`font-bold font-mono text-lg ${val >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
												{formatCurrency(val)}
											</div>
										</div>
									);
								}
								return null;
							}}
						/>
						<ReferenceLine y={0} stroke="#475569" />
						<Bar dataKey="profit" radius={[4, 4, 0, 0]}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.profit >= 0 ? '#10b981' : '#ef4444'}
									className="hover:opacity-80 transition-opacity"
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
