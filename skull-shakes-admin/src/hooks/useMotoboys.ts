import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

export interface Motoboy {
  id: number;
  nome: string;
  telefone: string;
  ativo: boolean;
}

export interface FechamentoReport {
  loja: {
    totalPedidos: number;
    receitaBruta: number;
    pix: number;
    cartao: number;
    dinheiro: number;
  };
  motoboys: {
    motoboyId: number;
    motoboyNome: string;
    totalEntregas: number;
    totalTaxas: number;
    totalDinheiroRecebido: number;
  }[];
}

export function useMotoboys() {
  return useQuery({
    queryKey: ['motoboys'],
    queryFn: async () => {
      const response = await api.get<Motoboy[]>('/admin/motoboys');
      return response.data;
    },
  });
}

export function useUpdatePedidoMotoboy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, motoboyId }: { id: number; motoboyId: number | null }) => {
      await api.put(`/admin/pedidos/${id}/motoboy`, { motoboyId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Entregador atribuído!');
    },
  });
}

export function useFechamento(date: string) {
  return useQuery({
    queryKey: ['fechamento', date],
    queryFn: async () => {
      const response = await api.get<FechamentoReport>(`/admin/relatorios/fechamento?date=${date}`);
      return response.data;
    },
  });
}
