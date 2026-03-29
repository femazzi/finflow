import { Plus, Trash2, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import type { Month } from "../../types";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

interface SidebarProps {
  months: Month[];
  selectedMonthId: string | null;
  onSelectMonth: (id: string | null) => void;
  onDeleteMonth: (id: string) => void;
  onOpenAddMonth: () => void;
}

export default function Sidebar({ months, selectedMonthId, onSelectMonth, onDeleteMonth, onOpenAddMonth }: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deletingMonthInfo, setDeletingMonthInfo] = useState<{ id: string, name: string } | null>(null);

  return (
    <>
      <aside className="w-64 h-screen fixed left-0 top-0 overflow-y-auto flex flex-col z-20 border-r border-white/5 glass-panel-heavy p-6">
        {/* Logo and Title */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-md">
            <span className="text-xl font-bold font-inter tracking-tighter">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight font-inter">
              Finflow
            </h1>
          </div>
        </div>

        {/* Global Dashboard Button */}
        <button
          onClick={() => onSelectMonth(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-4 transition-all duration-200 border ${
            selectedMonthId === null 
            ? 'bg-zinc-800/80 text-white border-white/10 shadow-sm' 
            : 'text-zinc-400 border-transparent hover:bg-zinc-800/50 hover:text-zinc-200'
          }`}
        >
          <LayoutDashboard size={18} className={selectedMonthId === null ? 'text-zinc-100' : ''} />
          <span className="font-medium text-sm">Visão Geral</span>
        </button>

        {/* Add New Month Button */}
        <button
          onClick={onOpenAddMonth}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl mb-8 bg-zinc-100 text-zinc-950 text-sm font-semibold transition-all hover:bg-white hover:scale-[1.02] shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} />
          Novo Mês
        </button>

        {/* Separator */}
        <div className="h-[1px] w-full bg-white/5 mb-6" />
        
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-2">Meus Meses</p>

        {/* Months List */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1.5">
          {months.length === 0 ? (
            <p className="text-zinc-500 text-xs text-center py-4 bg-zinc-800/20 rounded-lg border border-white/5">
              Nenhum mês criado
            </p>
          ) : (
            months.map((month) => {
              const totalTransactions =
                month.earnings.length +
                month.expenses.length +
                month.investments.length;
              const isSelected = selectedMonthId === month.id;

              return (
                <div
                  key={month.id}
                  className="relative mb-2 group"
                  onMouseEnter={() => setHoveredId(month.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    onClick={() => onSelectMonth(month.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "bg-zinc-800/80 border-white/10 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-zinc-800/40"
                    }`}
                  >
                    {/* Emoji */}
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${isSelected ? 'bg-zinc-700/50' : 'bg-white/5'}`}>
                      <span className="text-sm">{month.emoji}</span>
                    </div>

                    {/* Textos */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate leading-tight ${isSelected ? 'text-zinc-100 font-medium' : 'text-zinc-400 font-medium'}`}>
                        {month.name}
                      </p>
                      <p className="text-zinc-500 text-[10px] mt-0.5 font-medium tracking-wide">
                        {totalTransactions} transações
                      </p>
                    </div>

                    <button
                      onClick={e => {
                         e.preventDefault();
                         e.stopPropagation();
                         setDeletingMonthInfo({ id: month.id, name: month.name });
                      }}
                      className={`relative z-10 p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all ${
                        hoveredId === month.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      <ConfirmDeleteModal
        isOpen={deletingMonthInfo !== null}
        onClose={() => setDeletingMonthInfo(null)}
        onConfirm={() => {
          if (deletingMonthInfo) {
            onDeleteMonth(deletingMonthInfo.id);
          }
        }}
        title="Deletar Mês"
        description={`Tem certeza que deseja deletar "${deletingMonthInfo?.name}"? Esta ação removerá o mês e TODAS as suas transações permanentemente.`}
      />
    </>
  );
}
