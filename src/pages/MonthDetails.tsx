import { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  Edit2,
  Trash2,
  Plus
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import EditTransactionModal from "../components/modals/EditTransactionModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import type { Transaction, Month } from "../types";
import toast from "react-hot-toast";
import {
  EARNING_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
} from "../constants/categories";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

interface MonthDetailsProps {
  month: Month;
  allMonths: Month[];
  onBack: () => void;
  onAddTransaction: (
    monthId: string,
    type: "earnings" | "expenses" | "investments",
    transaction: Transaction
  ) => void;
  onDeleteTransaction: (
    monthId: string,
    type: "earnings" | "expenses" | "investments",
    transactionId: string
  ) => void;
  onEditTransaction: (
    monthId: string,
    type: "earnings" | "expenses" | "investments",
    transactionId: string,
    updates: Partial<Transaction>
  ) => void;
}

const StatCardMonth = ({ title, amount, icon: Icon, colorClass, isBalance }: any) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`glass-panel rounded-2xl p-5 md:p-6 flex flex-col justify-between h-[120px] ${isBalance ? 'bg-zinc-800/60 border-zinc-700/50' : 'bg-zinc-900/40'}`}
  >
    <div className="flex justify-between items-start mb-4 gap-4">
      <p className="text-zinc-500 text-[10px] md:text-xs font-bold tracking-widest uppercase truncate" title={title}>{title}</p>
      <div className={`shrink-0 opacity-80 ${colorClass}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
    </div>
    <div>
      <p className={`text-2xl md:text-3xl font-medium font-inter truncate ${isBalance ? 'text-zinc-50' : 'text-zinc-100'}`} title={formatCurrency(amount)}>{formatCurrency(amount)}</p>
    </div>
  </motion.div>
);

const TransactionList = ({ totalAmount, type, items, title, colorClass, IconTarget, onEdit, onDelete }: any) => (
  <div className="glass-panel bg-zinc-900/40 rounded-2xl p-6 mb-6">
    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
      <h3 className="text-zinc-100 font-medium text-base">{title}</h3>
      <span className={`font-semibold ${colorClass}`}>{formatCurrency(totalAmount)}</span>
    </div>
    {items.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-zinc-500 text-sm">Nenhum registro encontrado</p>
      </div>
    ) : (
      <div className="space-y-1">
        <AnimatePresence>
          {items.map((item: any) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-zinc-800/40 transition-colors border-b border-transparent hover:border-white/5 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 backdrop-blur-md bg-zinc-800`}>
                  <IconTarget size={14} className={colorClass} />
                </div>
                <div className="min-w-0">
                  <p className="text-zinc-200 text-sm font-medium mb-0.5 truncate">{item.description}</p>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`${colorClass} font-medium text-sm`}>{formatCurrency(item.amount)}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(item, type)} className="p-1.5 rounded-md text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(type, item.id)} className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

/**
 * MonthDetails orquestra a visualização detalhada de um Mês e todas as suas finanças.
 * 
 * NOTA DE PERFORMANCE (React Hoisting):
 * Componentes filhos como `StatCardMonth` e o complexo `TransactionList` foram declarados
 * FORA (Hoisted) deste componente funcional principal. Isso evita que o React crie novas
 * identificações de memória a cada re-renderização (o que previemente cortava as animações 
 * e fazia o cursor do usuário falhar nas caixas de texto ao digitar).
 */
export default function MonthDetails({
  month,
  onBack,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction,
}: MonthDetailsProps) {
  const [activeTab, setActiveTab] = useState<"earnings" | "expenses" | "investments">("earnings");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingType, setEditingType] = useState<"earnings" | "expenses" | "investments">("earnings");
  const [deletingTransactionInfo, setDeletingTransactionInfo] = useState<{type: "earnings" | "expenses" | "investments", id: string} | null>(null);

  if (!month) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Mês não encontrado</p>
        <button onClick={onBack} className="mt-4 text-primary-400 hover:underline">
          ← Voltar
        </button>
      </div>
    );
  }

  const getCategories = () => {
    const categoryMap = { earnings: EARNING_CATEGORIES, expenses: EXPENSE_CATEGORIES, investments: INVESTMENT_CATEGORIES };
    return categoryMap[activeTab];
  };

  const handleAddTransaction = () => {
    if (!description.trim()) { toast.error("Descrição é obrigatória"); return; }
    if (!amount || parseFloat(amount) <= 0) { toast.error("Valor deve ser maior que 0"); return; }
    if (!category) { toast.error("Categoria é obrigatória"); return; }

    onAddTransaction(month.id, activeTab, {
      id: uuidv4(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
    });

    setDescription("");
    setAmount("");
    setCategory("");
    const labels = { earnings: 'Ganho', expenses: 'Gasto', investments: 'Investimento' };
    toast.success(`${labels[activeTab]} adicionado com sucesso!`);
  };

  const handleEditOpen = (transaction: Transaction, type: "earnings" | "expenses" | "investments") => {
    setEditingTransaction(transaction); setEditingType(type);
  };
  const handleEditClose = () => setEditingTransaction(null);
  const handleEditSave = (updates: Partial<Transaction>) => {
    if (editingTransaction) {
      onEditTransaction(month.id, editingType, editingTransaction.id, updates);
      toast.success("Transação atualizada com sucesso!");
      handleEditClose();
    }
  };

  const handleDelete = (type: "earnings" | "expenses" | "investments", id: string) => {
    setDeletingTransactionInfo({ type, id });
  };


  return (
    <div className="w-full max-w-[1600px] mx-auto pb-20">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <button onClick={onBack} className="w-9 h-9 rounded-lg flex items-center justify-center bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-zinc-100 transition-all border border-white/5">
              <ArrowLeft size={16} />
            </button>
            <span className="text-2xl">{month.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 font-inter tracking-tight">{month.name}</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-[68px]">
            {month.earnings.length + month.expenses.length + month.investments.length} transações registradas
          </p>
        </div>
      </div>

      {/* 4 Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10 w-full">
        <StatCardMonth title="Ganhos" amount={month.totals.earnings} icon={TrendingUp} colorClass="text-emerald-500" />
        <StatCardMonth title="Gastos" amount={month.totals.expenses} icon={TrendingDown} colorClass="text-red-500" />
        <StatCardMonth title="Investido" amount={month.totals.investments} icon={BarChart3} colorClass="text-blue-500" />
        <StatCardMonth 
          isBalance
          title="Saldo Local" 
          amount={month.totals.balance} 
          icon={Wallet} 
          colorClass={month.totals.balance >= 0 ? "text-emerald-500" : "text-red-500"} 
        />
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-6">
        {(['earnings', 'expenses', 'investments'] as const).map(tab => {
          const colors = { earnings: 'border-emerald-500 text-emerald-500 bg-emerald-500/10', expenses: 'border-red-500 text-red-500 bg-red-500/10', investments: 'border-blue-500 text-blue-500 bg-blue-500/10' };
          const labels = { earnings: 'Receita', expenses: 'Despesa', investments: 'Investimento' };
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all border ${
                isActive ? colors[tab] : 'border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Card de Formulário */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel-heavy rounded-2xl p-4 md:p-6 mb-10 border border-white/5"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
          <div className="flex-1 w-full relative">
            <input
              placeholder="Ex: Pagamento, Mercado, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl px-4 py-3 font-inter text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all text-sm shadow-sm"
            />
          </div>
          
          <div className="w-full lg:w-48 shrink-0 relative">
            <input
              placeholder="R$ 0,00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl px-4 py-3 font-inter text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all text-sm font-medium hide-spin-button shadow-sm"
            />
          </div>

          <div className="w-full lg:w-48 shrink-0 relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-xl px-4 py-3 font-inter text-zinc-100 outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all text-sm appearance-none shadow-sm cursor-pointer"
            >
              <option value="" className="bg-zinc-900">Categoria...</option>
              {getCategories().map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
            </select>
          </div>

          <button
            onClick={handleAddTransaction}
            className={`w-full lg:w-[130px] shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${
              activeTab === 'earnings' ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400' :
              activeTab === 'expenses' ? 'bg-red-500 text-white hover:bg-red-400' :
              'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            <Plus size={16} strokeWidth={2.5} />
            Gravar
          </button>
        </div>
      </motion.div>

      {/* Listas de Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <TransactionList totalAmount={month.totals.earnings} type="earnings" items={month.earnings} title="Receitas" colorClass="text-emerald-500" IconTarget={TrendingUp} onEdit={handleEditOpen} onDelete={handleDelete} />
        <TransactionList totalAmount={month.totals.expenses} type="expenses" items={month.expenses} title="Despesas" colorClass="text-red-500" IconTarget={TrendingDown} onEdit={handleEditOpen} onDelete={handleDelete} />
        <TransactionList totalAmount={month.totals.investments} type="investments" items={month.investments} title="Investimentos" colorClass="text-blue-500" IconTarget={BarChart3} onEdit={handleEditOpen} onDelete={handleDelete} />
      </div>

      {/* Modal de Edição */}
      <EditTransactionModal
        isOpen={editingTransaction !== null}
        transaction={editingTransaction}
        type={editingType}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />

      <ConfirmDeleteModal
        isOpen={deletingTransactionInfo !== null}
        onClose={() => setDeletingTransactionInfo(null)}
        onConfirm={() => {
          if (deletingTransactionInfo) {
            onDeleteTransaction(month.id, deletingTransactionInfo.type, deletingTransactionInfo.id);
            toast.success("Deletado!");
          }
        }}
        title="Deletar Transação"
        description="Esta ação removerá permanentemente esta transação dos seus registros. Você não poderá desfazer."
      />
    </div>
  );
}
