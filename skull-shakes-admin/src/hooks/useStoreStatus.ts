import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

export function useStoreStatus() {
  return useQuery({
    queryKey: ['store-status'],
    queryFn: async () => {
      const response = await api.get<{ isAberta: boolean }>('/pedidos/configuracoes/status');
      return response.data;
    },
    refetchInterval: 30_000,
  });
}

export function useUpdateStoreStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isAberta: boolean) => {
      await api.put('/admin/configuracoes/status', { isAberta });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-status'] });
      toast.success('Status da loja atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar status da loja');
    },
  });
}
