import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';

export interface Adicional {
  id: number;
  nome: string;
  precoBase: number;
  disponivel: boolean;
  categoria: string;
}

export function useAdicionais() {
  return useQuery({
    queryKey: ['adicionais'],
    queryFn: async () => {
      const response = await api.get<Adicional[]>('/admin/adicionais');
      return response.data;
    },
  });
}

export function useToggleAdicional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.put(/admin/adicionais//toggle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adicionais'] });
      toast.success('Disponibilidade alterada!');
    },
    onError: () => {
      toast.error('Erro ao alterar disponibilidade');
    },
  });
}
