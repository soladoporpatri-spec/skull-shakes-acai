"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { useFechamento } from "@/hooks/useMotoboys";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Bike, DollarSign, CreditCard, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export default function FechamentoPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { data, isLoading, isError } = useFechamento(date);
  const queryClient = useQueryClient();

  const addMotoboy = useMutation({
    mutationFn: async (nome: string) => {
      await api.post('/admin/motoboys', { nome, telefone: '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
      toast.success('Motoboy adicionado!');
    }
  });

  const handleAddMotoboy = () => {
    const nome = window.prompt("Nome do novo motoboy:");
    if (nome) {
      addMotoboy.mutate(nome);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fechamento de Caixa</h2>
          <p className="text-muted-foreground">Relatório diário e acerto de motoboys.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAddMotoboy}><Plus className="h-4 w-4 mr-2" /> Motoboy</Button>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="w-40"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">Erro ao carregar relatório.</div>
      ) : !data ? (
        <div className="py-10 text-center">Nenhum dado encontrado.</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.loja.receitaBruta)}</div>
                <p className="text-xs text-muted-foreground">{data.loja.totalPedidos} pedidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(data.loja.pix)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cartão</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{formatCurrency(data.loja.cartao)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dinheiro</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{formatCurrency(data.loja.dinheiro)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acerto com Motoboys</CardTitle>
              <CardDescription>Valores a pagar pelas taxas e dinheiro físico a receber de volta.</CardDescription>
            </CardHeader>
            <CardContent>
              {data.motoboys.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">Nenhum motoboy com pedidos finalizados hoje.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motoboy</TableHead>
                      <TableHead>Entregas</TableHead>
                      <TableHead>Taxas (A Pagar)</TableHead>
                      <TableHead>Dinheiro com ele</TableHead>
                      <TableHead className="text-right">Acerto Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.motoboys.map((m) => {
                      // Acerto: Se ele tem 100 de dinheiro e a taxa é 20, ele devolve 80.
                      const acerto = m.totalDinheiroRecebido - m.totalTaxas;
                      const isLojaRecebe = acerto >= 0;
                      
                      return (
                        <TableRow key={m.motoboyId}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Bike className="h-4 w-4 text-muted-foreground"/> {m.motoboyNome}
                          </TableCell>
                          <TableCell>{m.totalEntregas}</TableCell>
                          <TableCell className="text-red-500">{formatCurrency(m.totalTaxas)}</TableCell>
                          <TableCell className="text-yellow-500">{formatCurrency(m.totalDinheiroRecebido)}</TableCell>
                          <TableCell className="text-right font-bold">
                            {isLojaRecebe ? `Devolve ${formatCurrency(acerto)}` : `Loja paga ${formatCurrency(Math.abs(acerto))}`}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
