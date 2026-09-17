"use client";



import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import api from "@/lib/api";

import { Pedido, OrderStatus } from "@/types";



export function usePedidos() {

  return useQuery<Pedido[]>({

    queryKey: ["pedidos"],

    queryFn: async () => {

      const response = await api.get<Pedido[]>("/admin/pedidos");

      return response.data;

    },

    refetchInterval: 30_000,

  });

}



export function useUpdatePedidoStatus() {

  const queryClient = useQueryClient();



  return useMutation({

    mutationFn: async ({

      id,

      status,

    }: {

      id: number;

      status: OrderStatus;

    }) => {

      await api.put(`/admin/pedidos/${id}/status`, { status });

    },

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["pedidos"] });

      toast.success("Status do pedido atualizado!");

    },

    onError: () => {

      toast.error("Erro ao atualizar status do pedido");

    },

  });

}


export function usePedidoHistorico(id?: number) {
  return useQuery({
    queryKey: ["pedidos", id, "historico"],
    queryFn: async () => {
      if (!id) return [];
      const response = await api.get(/admin/pedidos//historico);
      return response.data as { id: number; mensagem: string; responsavel: string; dataAlteracao: string; statusAnterior?: string; statusNovo?: string }[];
    },
    enabled: !!id,
  });
}
