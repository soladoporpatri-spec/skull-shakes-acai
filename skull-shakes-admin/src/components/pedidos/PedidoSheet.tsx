"use client";



import React, { useState } from "react";

import {

  Sheet,

  SheetContent,

  SheetHeader,

  SheetTitle,

  SheetDescription,

} from "@/components/ui/sheet";

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge";

import { Pedido, OrderStatus } from "@/types";

import { formatCurrency, formatDate, paymentMethodLabels, orderStatusLabels } from "@/lib/formatters";

import { useUpdatePedidoStatus } from "@/hooks/usePedidos";

import { MapPin, Phone, User, Calendar, CreditCard } from "lucide-react";
import { Printer } from "lucide-react";



const allStatuses: OrderStatus[] = [

  "Pending",

  "PaymentPending",

  "Paid",

  "Processing",

  "Shipped",

  "Delivered",

  "Canceled",

];



interface PedidoSheetProps {

  pedido: Pedido | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

}



export default function PedidoSheet({ pedido, open, onOpenChange }: PedidoSheetProps) {

  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [newPaymentStatus, setNewPaymentStatus] = useState<"Pending" | "Paid" | "Failed" | "Refunded" | "">("");

  const updateStatus = useUpdatePedidoStatus();



  const handlePrint = () => {
    window.print();
  };

  if (!pedido) return null;



  const handleUpdateStatus = () => {

    if (!newStatus) return;

    updateStatus.mutate(

      { id: pedido.id, status: newStatus },

      {

        onSuccess: () => {

          setNewStatus("");

        },

      }

    );

  };



  return (

    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent side="right" className="overflow-y-auto">

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

          {/* Info do cliente */}

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



          {/* Status */}

          <div className="space-y-3">

            <h3 className="text-sm font-semibold text-foreground">Status</h3>

            <div className="flex flex-wrap gap-2">

              <OrderStatusBadge status={pedido.statusPedido} />

              <PaymentStatusBadge status={pedido.statusPagamento} />

            </div>

          </div>



          {/* Datas e pagamento */}

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



          {/* Itens */}

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



          {/* Totais */}

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



          {/* Alterar status */}

          <div className="space-y-3 border-t border-border pt-4">

            <Label>Alterar Status do Pedido</Label>

            <Select

              value={newStatus}

              onValueChange={(val) => setNewStatus(val as OrderStatus)}

            >

              <SelectTrigger aria-label="Selecionar novo status">

                <SelectValue placeholder="Selecionar status" />

              </SelectTrigger>

              <SelectContent>

                {allStatuses.map((s) => (

                  <SelectItem key={s} value={s}>

                    {orderStatusLabels[s]}

                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

            <Button

              onClick={handleUpdateStatus}

              disabled={!newStatus || updateStatus.isPending}

              className="w-full"

              aria-label="Salvar alteração de status"

            >

              {updateStatus.isPending ? "Salvando..." : "Salvar"}

            </Button>

          </div>

        </div>

      </SheetContent>

    </Sheet>

  );

}
