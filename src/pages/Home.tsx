import { Wallet, TrendingUp, TrendingDown, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useMonths } from "../hooks/useMonths";
import { formatDate, formatCurrency } from "../utils/formatters";
import GlobalEvolutionChart from "../components/charts/GlobalEvolutionChart";

interface HomeProps {
  onSelectMonth: (monthId: string | null) => void;
}

const StatCard = ({ title, amount, icon: Icon, colorClass, delay, isBalance }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className={`glass-panel p-6 flex flex-col justify-between h-[130px] w-full ${isBalance ? 'bg-zinc-800/60 border-zinc-700/50' : ''}`}
  >
    <div className="flex justify-between items-start gap-4">
      <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase truncate" title={title}>{title}</p>
      <div className={`${colorClass} opacity-80`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
    </div>
    <div>
      <h2 className={`text-3xl font-medium font-inter tracking-tight truncate ${isBalance ? 'text-zinc-50' : 'text-zinc-100'}`} title={formatCurrency(amount)}>
        {formatCurrency(amount)}
      </h2>
    </div>
  </motion.div>
);

/**
 * Componente principal (Home) atuando como o dashboard global de inteligência de dados.
 * 
 * DESIGN DE PERFORMANCE:
 * - Computa métricas globais All-Time (Receitas, Despesas, Investimentos) de forma síncrona
 *   a partir do vetor `months` já cacheados eficientemente pelo React Query.
 * - Os StatCards (cards de saldo) são hoisted (declarados fora) desta função para manter o "Pure Component Performance"
 *   impecável (sem remounts da UI) durante a redução complexa de dados ou simples re-renders.
 */
export default function Home({ onSelectMonth }: HomeProps) {
  const { months, settings } = useMonths();

  // Calcular métricas globais All-Time
  const allTimeEarnings = months.reduce((acc, m) => acc + m.totals.earnings, 0);
  const allTimeExpenses = months.reduce((acc, m) => acc + m.totals.expenses, 0);
  const allTimeInvestments = months.reduce((acc, m) => acc + m.totals.investments, 0);
  const allTimeBalance = allTimeEarnings - allTimeExpenses - allTimeInvestments; // Fórmula do saldo global



  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20">
      {/* Cabeçalho Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-zinc-100 mb-1 font-inter tracking-tight">
          Olá, {settings.userName}
        </h1>
        <p className="text-zinc-500 text-sm">{formatDate(new Date())} · Visão Geral</p>
      </motion.div>

      {/* Cards Globais do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 w-full">
        <StatCard delay={0.1} isBalance title="Saldo Total" amount={allTimeBalance} icon={Wallet} colorClass="text-zinc-400" />
        <StatCard delay={0.15} title="Receitas (All)" amount={allTimeEarnings} icon={TrendingUp} colorClass="text-emerald-500" />
        <StatCard delay={0.2} title="Despesas (All)" amount={allTimeExpenses} icon={TrendingDown} colorClass="text-red-500" />
        <StatCard delay={0.25} title="Investido (All)" amount={allTimeInvestments} icon={Landmark} colorClass="text-blue-500" />
      </div>

      {months.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel-heavy rounded-2xl p-6 mb-10 border border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Curva de Acumulação
            </h2>
          </div>
          <GlobalEvolutionChart months={months} />
        </motion.div>
      )}

      {/* Seção Meus Meses */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold font-syne text-white mb-6 flex items-center gap-3">
          Histórico de Meses
        </h2>
        
        {months.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-dashed border-white/20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Wallet size={28} className="text-gray-400" />
            </div>
            <h3 className="text-white font-semibold mb-2 text-lg">
              Nenhum mês cadastrado ainda
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Para ver as mágicas do Dashboard Global, crie seu primeiro mês no botão "Novo Mês" na barra lateral!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 w-full">
            {months.map((month) => {
              const totalTransactions = month.earnings.length + month.expenses.length + month.investments.length;
              return (
                <div
                  key={month.id}
                  onClick={() => onSelectMonth(month.id)}
                  className="glass-panel cursor-pointer rounded-2xl p-6 group border border-white/5 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-6 w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center text-xl border border-white/5">
                        {month.emoji}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-zinc-100 truncate font-inter">{month.name}</h3>
                        <p className="text-zinc-500 text-[11px] mt-0.5 truncate uppercase tracking-widest">{totalTransactions} transações</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Entradas</p>
                      <p className="text-emerald-500 font-medium text-sm truncate font-inter">{formatCurrency(month.totals.earnings)}</p>
                    </div>
                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Saídas</p>
                      <p className="text-red-500 font-medium text-sm truncate font-inter">{formatCurrency(month.totals.expenses)}</p>
                    </div>
                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Investido</p>
                      <p className="text-blue-500 font-medium text-sm truncate font-inter">{formatCurrency(month.totals.investments)}</p>
                    </div>
                    <div className="bg-zinc-800 border-zinc-700/50 rounded-lg p-3 border">
                      <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">Balanço</p>
                      <p className="text-zinc-100 font-medium text-sm truncate font-inter">{formatCurrency(month.totals.balance)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
