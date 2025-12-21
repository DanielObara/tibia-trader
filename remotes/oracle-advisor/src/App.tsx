import { OracleAdvisor } from './OracleAdvisor'

// Mock Data for dev testing
const mockTransactions = [
	{ id: '1', itemName: 'Magic Plate Armor', npc: 'Rashid', buyPrice: 10000, npcPrice: 12000, profit: 2000, date: '2025-12-19' },
	{ id: '2', itemName: 'Dragon Scale Mail', npc: 'Rashid', buyPrice: 40000, npcPrice: 40000, profit: 0, date: '2025-12-19' },
	{ id: '3', itemName: 'Fire Sword', npc: 'Blue Djinn', buyPrice: 4000, npcPrice: 1000, profit: -3000, date: '2025-12-19' }
];

function App() {
	return (
		<div className="min-h-screen bg-slate-950 p-10 flex items-center justify-center">
			<div className="max-w-md w-full">
				<h1 className="text-white mb-4 font-bold">Remote Dev Environment</h1>
				<OracleAdvisor transactions={mockTransactions} />
			</div>
		</div>
	)
}

export default App
