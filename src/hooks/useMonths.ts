import { useState, useCallback } from "react";
import type { Month, Transaction } from "../types";
import { useLocalStorage } from "./useLocalStorage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Hook customizado que atua como a principal Camada de Acesso a Dados (DAL) e Gerenciador de Estado para o MVP Finflow.
 * 
 * DESIGN DE ARQUITETURA:
 * - Utiliza `@tanstack/react-query` para gerenciar o estado do servidor, fornecer cache agressivo e lidar 
 *   com casos exepcionais de carregamento/erro de forma contínua sem a complexidade de Contextos locais (Redux/Zustand).
 * - Todas as mutações do servidor inerentemente disparam um `queryClient.invalidateQueries` que força uma 
 *   re-busca em background da chave "months", sincronizando instantaneamente a UI.
 * - Esboça configurações locais (usuário/tema) via `useLocalStorage` para hidratação (hydration) instantânea do lado do cliente.
 */
const API_URL = "http://localhost:8080/api/months";

const DEFAULT_SETTINGS = {
  userName: "Mazzi",
  theme: "dark" as const,
};

export function useMonths() {
  const queryClient = useQueryClient();
  const [settings] = useLocalStorage("finflow_settings", DEFAULT_SETTINGS);
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);

  const { data: months = [] } = useQuery({
    queryKey: ["months"],
    queryFn: async () => {
      try {
        const res = await axios.get<Month[]>(API_URL);
        return res.data;
      } catch (err) {
        toast.error("Erro ao conectar no banco de dados.");
        return [];
      }
    },
  });



  const addMonthMutation = useMutation({
    mutationFn: async (newMonth: { name: string; emoji: string; color: string }) => {
      const res = await axios.post(API_URL, newMonth);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["months"] });
      setSelectedMonthId(data.id);
      toast.success("Mês gerado no servidor!");
    },
    onError: () => toast.error("Erro ao criar mês."),
  });

  const deleteMonthMutation = useMutation({
    mutationFn: async (monthId: string) => {
      await axios.delete(`${API_URL}/${monthId}`);
      return monthId;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["months"] });
      if (selectedMonthId === deletedId) {
        setSelectedMonthId(null);
      }
      toast.success("Mês deletado via API.");
    },
  });

  const updateMonthMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Month> }) => {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["months"] }),
  });

  const addTransactionMutation = useMutation({
    mutationFn: async ({ monthId, type, transaction }: { monthId: string, type: string, transaction: Transaction }) => {
      const apiType = type === "earnings" ? "EARNING" : type === "expenses" ? "EXPENSE" : "INVESTMENT";
      const res = await axios.post(`${API_URL}/${monthId}/transactions`, {
        ...transaction,
        type: apiType
      });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["months"] }),
    onError: () => toast.error("Erro ao salvar transação no banco."),
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async ({ monthId, transactionId }: { monthId: string, transactionId: string }) => {
      await axios.delete(`${API_URL}/${monthId}/transactions/${transactionId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["months"] }),
    onError: () => toast.error("Erro ao deletar transação."),
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ monthId, transactionId, type, updates }: { monthId: string, transactionId: string, type: string, updates: Partial<Transaction> }) => {
      const apiType = type === "earnings" ? "EARNING" : type === "expenses" ? "EXPENSE" : "INVESTMENT";
      const res = await axios.put(`${API_URL}/${monthId}/transactions/${transactionId}`, {
        ...updates,
        type: apiType
      });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["months"] }),
  });

  const initializeWithSampleData = useCallback(() => {
    // Mantido por compatibilidade
  }, []);

  const getSelectedMonth = () => months.find((m) => m.id === selectedMonthId);

  return {
    months,
    selectedMonthId,
    setSelectedMonthId,
    selectedMonth: getSelectedMonth(),
    addMonth: (name: string, emoji: string, color: string) => addMonthMutation.mutate({ name, emoji, color }),
    deleteMonth: (id: string) => deleteMonthMutation.mutate(id),
    updateMonth: (id: string, updates: Partial<Month>) => updateMonthMutation.mutate({ id, updates }),
    addTransaction: (monthId: string, type: "earnings" | "expenses" | "investments", transaction: Transaction) => 
      addTransactionMutation.mutate({ monthId, type, transaction }),
    deleteTransaction: (monthId: string, _type: "earnings" | "expenses" | "investments", transactionId: string) => 
      deleteTransactionMutation.mutate({ monthId, transactionId }),
    updateTransaction: (monthId: string, type: "earnings" | "expenses" | "investments", transactionId: string, updates: Partial<Transaction>) => 
      updateTransactionMutation.mutate({ monthId, transactionId, type, updates }),
    initializeWithSampleData,
    settings,
  };
}
