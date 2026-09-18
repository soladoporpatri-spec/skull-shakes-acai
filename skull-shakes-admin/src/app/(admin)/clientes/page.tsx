"use client";

import React, { useState } from "react";
import { useClientes, Cliente } from "@/hooks/usePedidos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Search, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientesPage() {
  const { data: clientes, isLoading } = useClientes();
  const [search, setSearch] = useState("");

  const filtered = React.useMemo(() => {
    if (!clientes) return [];
    return clientes.filter(c => 
      c.nome.toLowerCase().includes(search.toLowerCase()) || 
      c.telefone.includes(search)
    );
  }, [clientes, search]);

  const sendPromoWhatsApp = (cliente: Cliente) => {
    const text = encodeURIComponent(`Olá ${cliente.nome}! Tudo bem? Sentimos sua falta aqui no Skull Shakes. Preparamos uma oferta especial pra você:`);
    window.open(`https://wa.me/${cliente.telefone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">CRM / Clientes</h2>
          <p className="text-muted-foreground">Fidelização e histórico dos seus melhores clientes.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Cliente</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{clientes?.[0]?.nome || "-"}</div>
            <p className="text-xs text-muted-foreground">{clientes?.[0] ? formatCurrency(clientes[0].totalGasto) : ""}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base de Clientes</CardTitle>
          <CardDescription>Lista ranqueada por total gasto.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Nº Pedidos</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c, idx) => (
                  <TableRow key={c.telefone}>
                    <TableCell className="font-bold text-muted-foreground">#{idx + 1}</TableCell>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell>{c.telefone}</TableCell>
                    <TableCell className="font-bold text-green-500">{formatCurrency(c.totalGasto)}</TableCell>
                    <TableCell>{c.quantidadePedidos}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(c.ultimoPedido)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => sendPromoWhatsApp(c)}>
                        Enviar Promo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
