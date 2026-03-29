import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Transaction } from "../../types";
import {
  EARNING_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
} from "../../constants/categories";
import toast from "react-hot-toast";

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  type: "earnings" | "expenses" | "investments";
  onClose: () => void;
  onSave: (updates: Partial<Transaction>) => void;
}

export default function EditTransactionModal({
  isOpen,
  transaction,
  type,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const categoriesMap = {
    earnings: EARNING_CATEGORIES,
    expenses: EXPENSE_CATEGORIES,
    investments: INVESTMENT_CATEGORIES,
  };

  const typeLabel = {
    earnings: "Ganho",
    expenses: "Gasto",
    investments: "Investimento",
  };

  useEffect(() => {
    if (transaction && isOpen) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
    }
  }, [transaction, isOpen]);

  const handleSave = () => {
    if (!description.trim()) {
      toast.error("Descrição é obrigatória");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Valor deve ser maior que 0");
      return;
    }
    if (!category) {
      toast.error("Categoria é obrigatória");
      return;
    }

    onSave({
      description: description.trim(),
      amount: parseFloat(amount),
      category,
    });
  };

  if (!isOpen || !transaction) return null;

  return (
    isOpen && transaction && (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: '#1A1A2E',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: 0,
              fontFamily: 'Syne, sans-serif'
            }}>
              Editar {typeLabel[type]}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Campo Descrição */}
          <label style={{
            color: '#9CA3AF', fontSize: '13px',
            display: 'block', marginBottom: '6px'
          }}>
            Descrição
          </label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ex: Salário, Aluguel..."
            style={{
              width: '100%',
              backgroundColor: '#16161D',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#8b5cf6'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          {/* Campo Valor */}
          <label style={{
            color: '#9CA3AF', fontSize: '13px',
            display: 'block', marginBottom: '6px'
          }}>
            Valor
          </label>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="R$ 0,00"
            type="number"
            style={{
              width: '100%',
              backgroundColor: '#16161D',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#8b5cf6'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          {/* Campo Categoria */}
          <label style={{
            color: '#9CA3AF', fontSize: '13px',
            display: 'block', marginBottom: '6px'
          }}>
            Categoria
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#16161D',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '20px',
              boxSizing: 'border-box',
              cursor: 'pointer'
            }}
          >
            <option value="">Selecionar categoria...</option>
            {categoriesMap[type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#7c3aed',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6d28d9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7c3aed'}
            >
              Salvar Alterações
            </button>
          </div>

        </div>
      </div>
    )
  );
}
