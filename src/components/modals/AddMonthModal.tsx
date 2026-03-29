import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMonths } from "../../hooks/useMonths";
import { MONTH_EMOJIS } from "../../constants/categories";
import { getNextMonthName } from "../../utils/formatters";
import toast from "react-hot-toast";

interface AddMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMonthModal({ isOpen, onClose }: AddMonthModalProps) {
  const { addMonth, months } = useMonths();
  const [monthName, setMonthName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(MONTH_EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState("#8b5cf6");

  useEffect(() => {
    if (isOpen) {
      if (months.length > 0) {
        setMonthName(getNextMonthName(months[0].name));
      } else {
        setMonthName(getNextMonthName());
      }
    }
  }, [isOpen, months]);

  const EMOJIS = MONTH_EMOJIS;
  const COLORS = ['#8b5cf6','#a855f7','#ec4899','#ef4444','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#a78bfa'];

  const handleSave = () => {
    if (!monthName.trim()) {
      toast.error("Nome do mês é obrigatório");
      return;
    }

    addMonth(monthName, selectedEmoji, selectedColor);
    toast.success("Mês criado com sucesso!");
    onClose();
    setMonthName("");
    setSelectedEmoji(EMOJIS[0]);
    setSelectedColor(COLORS[0]);
  };

  return (
    isOpen && (
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
          maxWidth: '440px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              Novo Mês
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px', borderRadius: '6px', lineHeight: 1 }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Input nome */}
          <label style={{ color: '#9CA3AF', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
            Nome do Mês
          </label>
          <input
            value={monthName}
            onChange={e => setMonthName(e.target.value)}
            placeholder="Ex: Março 2025"
            style={{
              width: '100%',
              backgroundColor: '#16161D',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          />

          {/* Seletor de ícone */}
          <label style={{ color: '#9CA3AF', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Ícone
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: selectedEmoji === emoji
                    ? '2px solid #8b5cf6'
                    : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: selectedEmoji === emoji
                    ? 'rgba(139,92,246,0.2)'
                    : '#16161D',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Seletor de cor */}
          <label style={{ color: '#9CA3AF', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Cor
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: color,
                  border: 'none',
                  cursor: 'pointer',
                  outline: selectedColor === color ? '2px solid white' : '2px solid transparent',
                  outlineOffset: '2px',
                  transition: 'all 0.15s',
                  flexShrink: 0
                }}
              />
            ))}
          </div>

          {/* Pré-visualização */}
          <div style={{
            backgroundColor: '#16161D',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#6B7280', fontSize: '11px', margin: '0 0 8px 0' }}>
              Pré-visualização na sidebar:
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '6px',
              borderLeft: '3px solid ' + selectedColor,
              backgroundColor: selectedColor + '20'
            }}>
              <span style={{ fontSize: '16px' }}>{selectedEmoji}</span>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
                {monthName || 'Nome do mês'}
              </span>
            </div>
          </div>

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
              Criar Mês
            </button>
          </div>

        </div>
      </div>
    )
  );
}
