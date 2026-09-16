"use client";



import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import api from "@/lib/api";

import { Produto } from "@/types";



export function useProdutos() {

  return useQuery<Produto[]>({

    queryKey: ["produtos"],

    queryFn: async () => {

      const response = await api.get<Produto[]>("/cardapio");

      return response.data;

    },

  });

}



export function useUpdatePreco() {

  const queryClient = useQueryClient();



  return useMutation({

    mutationFn: async ({ id, novoPreco }: { id: number; novoPreco: number }) => {

      await api.put(`/admin/produtos/${id}/preco`, { novoPreco });

    },

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["produtos"] });

      toast.success("Preço atualizado com sucesso!");

    },

    onError: () => {

      toast.error("Erro ao atualizar preço");

    },

  });

}



export function useCreateProduto() {

  const queryClient = useQueryClient();



  return useMutation({

    mutationFn: async (data: {

      nome: string;

      descricao: string;

      precoBase: number;

      urlImagem: string;

      disponivel: boolean;

    }) => {

      await api.post("/admin/produtos", data);

    },

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ["produtos"] });

      toast.success("Produto criado com sucesso!");

    },

    onError: () => {

      toast.error("Erro ao criar produto");

    },

  });

}
