"use client";



import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import api from "@/lib/api";

import { Pedido, OrderStatus, PaymentStatus } from "@/types";



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
      paymentStatus
    }: {
      id: number;
      status: OrderStatus;
      paymentStatus?: PaymentStatus;
    }) => {
      await api.put(`/admin/pedidos/${id}/status`, { status, paymentStatus });
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
      const response = await api.get(`/admin/pedidos/${id}/historico`);
      return response.data as { id: number; mensagem: string; responsavel: string; dataAlteracao: string; statusAnterior?: string; statusNovo?: string }[];
    },
    enabled: !!id,
  });
}


export interface Cliente {
  telefone: string;
  nome: string;
  totalGasto: number;
  quantidadePedidos: number;
  ultimoPedido: string;
}

export function useClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await api.get<Cliente[]>("/admin/clientes");
      return response.data;
    },
  });
}
