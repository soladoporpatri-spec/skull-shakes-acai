# -*- coding: utf-8 -*-
import re

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add PaymentStatus enum list
content = content.replace(
'''const allStatuses: OrderStatus[] = [
  "Pending",
  "PaymentPending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Canceled",
];''',
'''const allStatuses: OrderStatus[] = [
  "Pending",
  "PaymentPending",
  "Paid",
  "Processing",
  "Shipped",
  "OutForDelivery",
  "Delivered",
  "Canceled",
];

const allPaymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
  "Canceled"
];

const paymentStatusLabels: Record<string, string> = {
  Pending: "Pendente",
  Paid: "Pago",
  Failed: "Falhou",
  Refunded: "Reembolsado",
  Canceled: "Cancelado"
};'''
)

# Add state and handle function for payment
content = content.replace(
'''  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const updateStatus = useUpdatePedidoStatus();

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
  };''',
'''  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>("");
  const updateStatus = useUpdatePedidoStatus();

  if (!pedido) return null;

  const handleUpdateStatus = () => {
    if (!newStatus && !newPaymentStatus) return;
    updateStatus.mutate(
      { 
        id: pedido.id, 
        status: newStatus || undefined,
        paymentStatus: newPaymentStatus || undefined 
      },
      {
        onSuccess: () => {
          setNewStatus("");
          setNewPaymentStatus("");
        },
      }
    );
  };'''
)

# Add payment select to UI
content = content.replace(
'''          {/* Alterar status */}
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
          </div>''',
'''          {/* Alterar status */}
          <div className="space-y-4 border-t border-border pt-4">
            
            <div className="space-y-2">
              <Label>Alterar Status do Pedido</Label>
              <Select
                value={newStatus}
                onValueChange={(val) => setNewStatus(val as OrderStatus)}
              >
                <SelectTrigger aria-label="Selecionar novo status">
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Não alterar --</SelectItem>
                  {allStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {orderStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alterar Status de Pagamento</Label>
              <Select
                value={newPaymentStatus}
                onValueChange={(val) => setNewPaymentStatus(val)}
              >
                <SelectTrigger aria-label="Selecionar novo status de pagamento">
                  <SelectValue placeholder="Selecionar pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Não alterar --</SelectItem>
                  {allPaymentStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {paymentStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleUpdateStatus}
              disabled={(!newStatus && !newPaymentStatus) || updateStatus.isPending || (newStatus === "none" && newPaymentStatus === "none")}
              className="w-full mt-4"
              aria-label="Salvar alteração de status"
            >
              {updateStatus.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>'''
)

# And fix handle logic for 'none'
content = content.replace(
'''  const handleUpdateStatus = () => {
    if (!newStatus && !newPaymentStatus) return;
    updateStatus.mutate(
      { 
        id: pedido.id, 
        status: newStatus || undefined,
        paymentStatus: newPaymentStatus || undefined 
      },''',
'''  const handleUpdateStatus = () => {
    if ((!newStatus || newStatus === "none") && (!newPaymentStatus || newPaymentStatus === "none")) return;
    updateStatus.mutate(
      { 
        id: pedido.id, 
        status: newStatus !== "none" ? newStatus || undefined : undefined,
        paymentStatus: newPaymentStatus !== "none" ? newPaymentStatus || undefined : undefined 
      },'''
)

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
