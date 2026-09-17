"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge";
import { Pedido, OrderStatus } from "@/types";
import { formatCurrency, formatDate, paymentMethodLabels, orderStatusLabels } from "@/lib/formatters";
import { useUpdatePedidoStatus, usePedidoHistorico } from "@/hooks/usePedidos";
import { MapPin, Phone, User, Calendar, CreditCard, Printer, History, Clock } from "lucide-react";
import { useMotoboys, useUpdatePedidoMotoboy } from "@/hooks/useMotoboys";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface PedidoSheetProps {
  pedido: Pedido | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PedidoSheet({ pedido, open, onOpenChange }: PedidoSheetProps) {
  const { data: motoboys } = useMotoboys();
  const updateMotoboy = useUpdatePedidoMotoboy();
  const updateStatus = useUpdatePedidoStatus();

  // Use hook only if pedido exists
  const { data: historico } = usePedidoHistorico(pedido?.id);

  if (!pedido) return null;

  const handlePrint = () => {
    window.print();
  };

  const setStatus = (newStatus: OrderStatus) => {
    updateStatus.mutate({ id: pedido.id, status: newStatus });
  };

  const approvePayment = () => {
    updateStatus.mutate({ id: pedido.id, status: pedido.statusPedido, paymentStatus: 'Paid' });
  };

  const isDelivery = pedido.modalidadePagamento === 'OnDelivery' || pedido.modalidadePagamento === 'Online';
  const showAssignDriver = isDelivery && (pedido.statusPedido === 'Ready' || pedido.statusPedido === 'InTransit' || pedido.statusPedido === 'Delivered');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-md w-full">
        <SheetHeader>
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-xl">Pedido #{pedido.id}</SheetTitle>
              <SheetDescription>
                {formatDate(pedido.dataPedido)}
              </SheetDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Actions */}
          <div className="p-4 bg-secondary/30 rounded-lg space-y-3 print:hidden">
            <h3 className="text-sm font-semibold text-foreground">Ações Rápidas</h3>
            <div className="flex flex-col gap-2">
              {pedido.statusPagamento === 'Pending' && (
                <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={approvePayment} disabled={updateStatus.isPending}>
                  Aprovar Pagamento
                </Button>
              )}
              
              {pedido.statusPedido === 'Pending' && pedido.statusPagamento === 'Paid' && (
                <Button variant="default" className="w-full" onClick={() => setStatus('Processing')} disabled={updateStatus.isPending}>
                  Iniciar Preparo
                </Button>
              )}

              {pedido.statusPedido === 'Processing' && (
                <Button variant="default" className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setStatus('Ready')} disabled={updateStatus.isPending}>
                  Marcar como Pronto
                </Button>
              )}

              {pedido.statusPedido === 'Ready' && isDelivery && (
                <Button variant="default" className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setStatus('InTransit')} disabled={updateStatus.isPending}>
                  Saiu para Entrega
                </Button>
              )}

              {pedido.statusPedido === 'Ready' && !isDelivery && (
                <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setStatus('Delivered')} disabled={updateStatus.isPending}>
                  Marcar como Retirado
                </Button>
              )}

              {pedido.statusPedido === 'InTransit' && (
                <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setStatus('Delivered')} disabled={updateStatus.isPending}>
                  Marcar como Entregue
                </Button>
              )}

              {pedido.statusPedido !== 'Delivered' && pedido.statusPedido !== 'Cancelled' && (
                <Button variant="destructive" className="w-full mt-4" onClick={() => {
                  if(window.confirm('Tem certeza que deseja CANCELAR este pedido?')) setStatus('Cancelled');
                }} disabled={updateStatus.isPending}>
                  Cancelar Pedido
                </Button>
              )}
            </div>
          </div>

          {showAssignDriver && (
            <div className="space-y-3 border-border pt-2 print:hidden">
              <Label>Atribuir Entregador</Label>
              <Select
                value={pedido.motoboyId?.toString() || "unassigned"}
                onValueChange={(val) => {
                  if (val === "unassigned") return;
                  updateMotoboy.mutate({ pedidoId: pedido.id, motoboyId: parseInt(val) });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motoboy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sem entregador</SelectItem>
                  {motoboys?.map((m) => (
                    <SelectItem key={m.motoboyId} value={m.motoboyId.toString()}>
                      {m.motoboyNome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Cliente</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{pedido.nomeCliente}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{pedido.telefone}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{pedido.endereco}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Status</h3>
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge status={pedido.statusPedido} />
              <PaymentStatusBadge status={pedido.statusPagamento} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Informações</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Pedido: {formatDate(pedido.dataPedido)}</span>
              </div>
              {pedido.dataPagamento && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Pago: {formatDate(pedido.dataPagamento)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{paymentMethodLabels[pedido.formaPagamento]}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Itens</h3>
            <div className="space-y-2">
              {pedido.itens.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.produto}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantidade}x {formatCurrency(item.precoUnitario)}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(item.quantidade * item.precoUnitario)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(pedido.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entrega</span>
              <span>{formatCurrency(pedido.deliveryFee)}</span>
            </div>
            {pedido.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Desconto</span>
                <span className="text-green-400">
                  -{formatCurrency(pedido.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold border-t border-border pt-2">
              <span>Total</span>
              <span className="text-accent">{formatCurrency(pedido.total)}</span>
            </div>
          </div>

          {/* Timeline de Histórico */}
          <div className="space-y-3 border-t border-border pt-4 print:hidden">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <History className="h-4 w-4" /> Timeline do Pedido
            </h3>
            {historico && historico.length > 0 ? (
              <ScrollArea className="h-48 pr-4">
                <div className="space-y-4">
                  {historico.map((h, i) => (
                    <div key={h.id} className="relative pl-6">
                      <div className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
                      {i !== historico.length - 1 && (
                        <div className="absolute left-2 top-3.5 bottom-[-16px] w-[1px] bg-border" />
                      )}
                      <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatDate(h.dataAlteracao)} • {h.responsavel}
                      </div>
                      <p className="text-sm font-medium">{h.mensagem}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum histórico registrado.</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
