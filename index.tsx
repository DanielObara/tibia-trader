
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  History, 
  Search, 
  LogOut, 
  Save, 
  LayoutDashboard, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Scroll,
  User,
  ShieldAlert,
  Sword,
  Shield,
  Gem
} from 'lucide-react';

// --- Types ---

type NpcName = 'Rashid' | 'Blue Djinn' | 'Green Djinn';

interface Item {
  id: string;
  name: string;
  npc: NpcName;
  price: number; // NPC Buy Price
  category: 'armor' | 'weapon' | 'helmet' | 'shield' | 'boots' | 'other';
}

interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  npc: NpcName;
  npcPrice: number;
  buyPrice: number;
  quantity: number;
  profit: number;
  date: string; // ISO Date
  timestamp: number;
}

interface UserProfile {
  name: string;
  vocation: string;
  level: number;
  world: string;
}

// --- Mock Data (Expanded from TibiaWiki) ---

const MOCK_ITEMS: Item[] = [
  // --- Rashid (Sexta-feira em Carlin / Etc) ---
  { id: 'r1', name: 'Dragon Scale Mail', npc: 'Rashid', price: 40000, category: 'armor' },
  { id: 'r2', name: 'Mastermind Shield', npc: 'Rashid', price: 50000, category: 'shield' },
  { id: 'r3', name: 'Golden Armor', npc: 'Rashid', price: 20000, category: 'armor' },
  { id: 'r4', name: 'Royal Helmet', npc: 'Rashid', price: 30000, category: 'helmet' },
  { id: 'r5', name: 'Dragon Slayer', npc: 'Rashid', price: 4400, category: 'weapon' },
  { id: 'r6', name: 'Skull Staff', npc: 'Rashid', price: 6000, category: 'weapon' },
  { id: 'r7', name: 'Devil Helmet', npc: 'Rashid', price: 1000, category: 'helmet' },
  { id: 'r8', name: 'Golden Legs', npc: 'Rashid', price: 30000, category: 'armor' },
  { id: 'r9', name: 'Mercenary Sword', npc: 'Rashid', price: 12000, category: 'weapon' },
  { id: 'r10', name: 'Nightmare Blade', npc: 'Rashid', price: 35000, category: 'weapon' },
  { id: 'r11', name: 'Heroic Axe', npc: 'Rashid', price: 30000, category: 'weapon' },
  { id: 'r12', name: 'Cranial Basher', npc: 'Rashid', price: 30000, category: 'weapon' },
  { id: 'r13', name: 'Relic Sword', npc: 'Rashid', price: 25000, category: 'weapon' },
  { id: 'r14', name: 'Drakinata', npc: 'Rashid', price: 10000, category: 'weapon' },
  { id: 'r15', name: 'Mammoth Fur Cape', npc: 'Rashid', price: 6000, category: 'armor' },
  { id: 'r16', name: 'Leopard Armor', npc: 'Rashid', price: 1000, category: 'armor' },
  { id: 'r17', name: 'Paladin Armor', npc: 'Rashid', price: 15000, category: 'armor' },
  { id: 'r18', name: 'Steel Boots', npc: 'Rashid', price: 30000, category: 'boots' },
  { id: 'r19', name: 'Assassin Dagger', npc: 'Rashid', price: 20000, category: 'weapon' },
  { id: 'r20', name: 'Spiked Squelcher', npc: 'Rashid', price: 5000, category: 'weapon' },

  // --- Blue Djinn (Nah'Bob - Ankrahmun) ---
  { id: 'b1', name: 'Boots of Haste', npc: 'Blue Djinn', price: 30000, category: 'boots' },
  { id: 'b2', name: 'Blue Robe', npc: 'Blue Djinn', price: 10000, category: 'armor' },
  { id: 'b3', name: 'Crown Armor', npc: 'Blue Djinn', price: 12000, category: 'armor' },
  { id: 'b4', name: 'Crown Legs', npc: 'Blue Djinn', price: 12000, category: 'armor' },
  { id: 'b5', name: 'Mystic Turban', npc: 'Blue Djinn', price: 150, category: 'helmet' },
  { id: 'b6', name: 'Fire Sword', npc: 'Blue Djinn', price: 4000, category: 'weapon' },
  { id: 'b7', name: 'Dragon Shield', npc: 'Blue Djinn', price: 4000, category: 'shield' },
  { id: 'b8', name: 'Obsidian Lance', npc: 'Blue Djinn', price: 500, category: 'weapon' },
  { id: 'b9', name: 'Vampire Shield', npc: 'Blue Djinn', price: 15000, category: 'shield' },
  { id: 'b10', name: 'Crown Shield', npc: 'Blue Djinn', price: 8000, category: 'shield' },
  { id: 'b11', name: 'Phoenix Shield', npc: 'Blue Djinn', price: 16000, category: 'shield' },
  { id: 'b12', name: 'Crusader Helmet', npc: 'Blue Djinn', price: 6000, category: 'helmet' },
  { id: 'b13', name: 'Noble Armor', npc: 'Blue Djinn', price: 900, category: 'armor' },
  { id: 'b14', name: 'Crown Helmet', npc: 'Blue Djinn', price: 2500, category: 'helmet' },
  { id: 'b15', name: 'Broadsword', npc: 'Blue Djinn', price: 500, category: 'weapon' },
  { id: 'b16', name: 'Dragon Lance', npc: 'Blue Djinn', price: 9000, category: 'weapon' },
  { id: 'b17', name: 'Ice Rapier', npc: 'Blue Djinn', price: 1000, category: 'weapon' },
  { id: 'b18', name: 'Skull Helmet', npc: 'Blue Djinn', price: 40000, category: 'helmet' },
  { id: 'b19', name: 'Royal Spear', npc: 'Blue Djinn', price: 15, category: 'weapon' },

  // --- Green Djinn (Alesar - Ankrahmun/Yalahar) ---
  { id: 'g1', name: 'Knight Armor', npc: 'Green Djinn', price: 5000, category: 'armor' },
  { id: 'g2', name: 'Knight Legs', npc: 'Green Djinn', price: 5000, category: 'armor' },
  { id: 'g3', name: 'Warrior Helmet', npc: 'Green Djinn', price: 5000, category: 'helmet' },
  { id: 'g4', name: 'Tower Shield', npc: 'Green Djinn', price: 8000, category: 'shield' },
  { id: 'g5', name: 'Giant Sword', npc: 'Green Djinn', price: 17000, category: 'weapon' },
  { id: 'g6', name: 'Dragon Hammer', npc: 'Green Djinn', price: 2000, category: 'weapon' },
  { id: 'g7', name: 'Plate Armor', npc: 'Green Djinn', price: 400, category: 'armor' },
  { id: 'g8', name: 'Titan Axe', npc: 'Green Djinn', price: 4000, category: 'weapon' },
  { id: 'g9', name: 'Guardian Shield', npc: 'Green Djinn', price: 2000, category: 'shield' },
  { id: 'g10', name: 'Fire Axe', npc: 'Green Djinn', price: 8000, category: 'weapon' },
  { id: 'g11', name: 'Serpent Sword', npc: 'Green Djinn', price: 900, category: 'weapon' },
  { id: 'g12', name: 'Hailstorm Rod', npc: 'Green Djinn', price: 3000, category: 'weapon' },
  { id: 'g13', name: 'Terra Rod', npc: 'Green Djinn', price: 2000, category: 'weapon' },
  { id: 'g14', name: 'Underworld Rod', npc: 'Green Djinn', price: 4400, category: 'weapon' },
  { id: 'g15', name: 'Springsprout Rod', npc: 'Green Djinn', price: 3600, category: 'weapon' },
  { id: 'g16', name: 'Wand of Inferno', npc: 'Green Djinn', price: 3000, category: 'weapon' },
  { id: 'g17', name: 'Wand of Starstorm', npc: 'Green Djinn', price: 3600, category: 'weapon' },
  { id: 'g18', name: 'Wand of Voodoo', npc: 'Green Djinn', price: 4400, category: 'weapon' },
];

// --- Utilities ---

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR').format(val) + ' gp';
};

const getItemIcon = (category: string) => {
  switch(category) {
    case 'armor': return '👕';
    case 'weapon': return '⚔️';
    case 'helmet': return '🪖';
    case 'shield': return '🛡️';
    case 'boots': return '👢';
    default: return '📦';
  }
};

// --- Components ---

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
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

const OracleAdvisor = ({ transactions }: { transactions: Transaction[] }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    if (!process.env.API_KEY) {
      setAdvice("Configure a chave de API para consultar o Oráculo.");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const summary = transactions.slice(0, 30).map(t => 
        `Item: ${t.itemName}, NPC: ${t.npc}, Paguei: ${t.buyPrice}, Vendi: ${t.npcPrice}, Lucro: ${t.profit}`
      ).join('\n');

      const prompt = `
        Você é um Goblin Mercador do Tibia muito esperto e ganancioso. Analise minhas transações recentes:
        ${summary}

        Me dê um conselho curto (máx 2 frases) sobre como melhorar meu lucro. Use gírias de Tibia em português (ex: "profit", "waste", "hunt", "stonks", "noob", "rashid").
        Se eu tiver muito prejuízo, tire sarro. Se tiver lucro, elogie mas peça gorjeta.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAdvice(response.text);
    } catch (e) {
      console.error(e);
      setAdvice("O Oráculo está dormindo (Erro de API). Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-950/80 to-slate-900 rounded-xl p-6 border border-purple-500/30 shadow-lg relative overflow-hidden group">
      {/* Decorative BG */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2 mb-2">
          <Gem className="w-5 h-5 text-purple-400" /> Oráculo Goblin
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
          disabled={loading || transactions.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-lg border border-purple-500/20"
        >
          {loading ? (
            <span className="flex items-center gap-2"><Sparkles className="animate-spin" size={16}/> Consultando Espíritos...</span>
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

const ProfileView = ({ transactions }: { transactions: Transaction[] }) => {
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
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mundo</label>
            <input 
              value={profile.world}
              onChange={(e) => setProfile({...profile, world: e.target.value})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Level</label>
            <input 
              type="number"
              value={profile.level}
              onChange={(e) => setProfile({...profile, level: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ transactions }: { transactions: Transaction[] }) => {
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
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-slate-200 font-bold flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              Performance (Últimos 7 dias)
            </h4>
          </div>
          
          <div className="flex-1 flex items-end gap-3 px-2 h-48 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
               <div className="border-t border-slate-500 w-full"></div>
               <div className="border-t border-slate-500 w-full"></div>
               <div className="border-t border-slate-500 w-full"></div>
            </div>

            {stats.last7Days.map((day, idx) => {
              const maxProfit = Math.max(...stats.last7Days.map(d => Math.abs(d.profit)), 1);
              const heightPerc = Math.min((Math.abs(day.profit) / maxProfit) * 100, 100);
              const isPositive = day.profit >= 0;
              const barHeight = Math.max(heightPerc, 2); // Min height 2%
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end z-10">
                   <div className="w-full relative flex flex-col justify-end h-full">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-500 relative ${isPositive ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-red-500 hover:bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}
                        style={{ height: `${barHeight}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600 shadow-xl pointer-events-none">
                          {formatCurrency(day.profit)}
                          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-600 rotate-45"></div>
                        </div>
                      </div>
                   </div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">{day.date.slice(8)}/{day.date.slice(5,7)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Advisor Column */}
        <div className="lg:col-span-1">
          <OracleAdvisor transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

const MarketTable = ({ 
  npc, 
  onAddTransaction 
}: { 
  npc: NpcName, 
  onAddTransaction: (t: Omit<Transaction, 'id' | 'date' | 'timestamp'>) => void 
}) => {
  const items = useMemo(() => MOCK_ITEMS.filter(i => i.npc === npc), [npc]);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl flex flex-col h-[calc(100vh-200px)] md:h-auto">
      {/* Header com Busca */}
      <div className="p-5 border-b border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-850">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar item (ex: Magic Sword)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
          />
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
              <th className="p-4 bg-slate-900 text-right hidden sm:table-cell">Preço NPC</th>
              <th className="p-4 bg-slate-900 text-right">Compra / Qtd</th>
              <th className="p-4 bg-slate-900 text-right">Resultado</th>
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
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-lg text-lg border border-slate-700 group-hover:border-slate-500 transition-colors shadow-sm">
                        {getItemIcon(item.category)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{item.name}</div>
                        <div className="text-xs text-slate-500 sm:hidden mt-0.5">NPC: {item.price/1000}k</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-amber-400 font-medium hidden sm:table-cell">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <div className="relative">
                         <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">GP</span>
                         <input
                          type="number"
                          placeholder="0"
                          className="w-28 bg-slate-950 border border-slate-600 rounded px-2 pl-6 py-1.5 text-right focus:border-amber-500 outline-none text-white text-sm transition-colors"
                          value={vals.buyPrice}
                          onChange={(e) => handleInputChange(item.id, 'buyPrice', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] text-slate-500 uppercase">Qtd</span>
                         <input 
                           type="number" 
                           min="1"
                           className="w-16 bg-slate-950 border border-slate-600 rounded px-2 py-1 text-right focus:border-amber-500 outline-none text-slate-300 text-xs"
                           value={vals.quantity}
                           onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                         />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end justify-center h-full">
                       <div className={`font-mono font-bold text-base ${isProfitable ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-slate-500'}`}>
                         {buyPrice > 0 ? (totalProfit > 0 ? '+' : '') + totalProfit.toLocaleString() : '-'}
                       </div>
                       {buyPrice > 0 && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold mt-1 ${
                          isProfitable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          isLoss ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {isProfitable ? <ArrowUpRight size={10}/> : isLoss ? <ArrowDownRight size={10}/> : null}
                          {Math.round(margin)}%
                        </span>
                       )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      disabled={!buyPrice || quantity < 1}
                      onClick={() => {
                        onAddTransaction({
                          itemId: item.id,
                          itemName: item.name,
                          npc: item.npc,
                          npcPrice: item.price,
                          buyPrice,
                          quantity,
                          profit: totalProfit
                        });
                        // Reset input after add? Maybe keep it for multiple adds.
                      }}
                      className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all shadow-lg shadow-amber-900/20 active:scale-95 group/btn"
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

// --- Main Application ---

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'market' | 'history' | 'profile'>('dashboard');
  const [activeNpc, setActiveNpc] = useState<NpcName>('Rashid');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tibia-transactions-v2');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
    const auth = localStorage.getItem('tibia-auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('tibia-transactions-v2', JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('tibia-auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tibia-auth');
    setCurrentView('dashboard');
  };

  const addTransaction = (t: Omit<Transaction, 'id' | 'date' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
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
                <DashboardStats transactions={transactions} />
              </div>
            )}

            {currentView === 'profile' && <ProfileView transactions={transactions} />}

            {currentView === 'market' && (
              <div className="space-y-6 fade-in h-full">
                 <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Mercado NPC</h1>
                    <p className="text-sm text-slate-400">Calculadora de profit em tempo real.</p>
                  </div>
                  
                  {/* NPC Selector */}
                  <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner w-full lg:w-auto overflow-x-auto">
                    {(['Rashid', 'Blue Djinn', 'Green Djinn'] as NpcName[]).map(n => (
                      <button
                        key={n}
                        onClick={() => setActiveNpc(n)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex-1 lg:flex-none ${activeNpc === n ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
                      >
                         <span className={activeNpc === n ? 'text-amber-500' : ''}>{n}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <MarketTable npc={activeNpc} onAddTransaction={addTransaction} />
              </div>
            )}

            {currentView === 'history' && (
              <div className="space-y-6 fade-in">
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Histórico</h1>
                    <p className="text-slate-400 text-sm">Log completo de transações.</p>
                  </div>
                  {transactions.length > 0 && (
                    <button 
                      onClick={() => {
                         if(window.confirm('Tem certeza que deseja apagar todo o histórico? Essa ação é irreversível.')) {
                           setTransactions([]);
                         }
                      }}
                      className="text-xs text-red-500 hover:text-red-400 font-medium px-3 py-1.5 rounded border border-red-500/20 hover:bg-red-500/10 transition-colors"
                    >
                      Limpar Histórico
                    </button>
                  )}
                </div>
                
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                   {transactions.length === 0 ? (
                     <div className="p-20 text-center text-slate-500 flex flex-col items-center">
                       <div className="bg-slate-900 p-8 rounded-full mb-6 border border-slate-700">
                          <History className="w-16 h-16 opacity-30" />
                       </div>
                       <p className="text-xl font-medium text-slate-400">Nada por aqui ainda.</p>
                       <p className="text-sm mt-2 text-slate-500">Faça trades no Mercado para popular seu histórico.</p>
                     </div>
                   ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-xs tracking-wider">
                          <tr>
                            <th className="p-4 pl-6">Data</th>
                            <th className="p-4">Item</th>
                            <th className="p-4">NPC</th>
                            <th className="p-4 text-right">Compra</th>
                            <th className="p-4 text-right">Venda</th>
                            <th className="p-4 text-right">Qtd</th>
                            <th className="p-4 text-right pr-6">Lucro</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                              <td className="p-4 pl-6 text-slate-500 whitespace-nowrap font-mono text-xs">{t.date}</td>
                              <td className="p-4 font-bold text-slate-200">{t.itemName}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${
                                  t.npc === 'Rashid' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                  t.npc === 'Blue Djinn' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                                  'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                                }`}>{t.npc}</span>
                              </td>
                              <td className="p-4 text-right text-slate-400">{t.buyPrice.toLocaleString()}</td>
                              <td className="p-4 text-right text-slate-400">{t.npcPrice.toLocaleString()}</td>
                              <td className="p-4 text-right text-slate-300 font-mono">{t.quantity}</td>
                              <td className={`p-4 text-right pr-6 font-bold font-mono ${t.profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {t.profit > 0 ? '+' : ''}{t.profit.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 4px; }
        .fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
