# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add newPaymentStatus state
content = content.replace('const [newStatus, setNewStatus] = useState<OrderStatus | "">("");', 'const [newStatus, setNewStatus] = useState<OrderStatus | "">("");\n  const [newPaymentStatus, setNewPaymentStatus] = useState<"Pending" | "Paid" | "Failed" | "Refunded" | "">("");')

# Fix updateStatus call to handle payment status
old_update = """  const handleUpdateStatus = () => {
    if (!newStatus) return;
    updateStatus.mutate(
      { id: pedido.id, status: newStatus },
      {
        onSuccess: () => {
          setNewStatus("");
        },
      }
    );
  };"""

new_update = """  const handleUpdateStatus = () => {
    if (!newStatus && !newPaymentStatus) return;
    updateStatus.mutate(
      { 
        id: pedido.id, 
        status: newStatus || undefined,
        paymentStatus: newPaymentStatus || undefined 
      } as any,
      {
        onSuccess: () => {
          setNewStatus("");
          setNewPaymentStatus("");
        },
      }
    );
  };"""

content = content.replace(old_update, new_update)

# Add Payment Status dropdown to UI
old_ui = """                <SelectValue placeholder="Novo Status" />
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
              className="w-full mt-2"
              onClick={handleUpdateStatus}
              disabled={!newStatus || updateStatus.isPending}
            >
              {updateStatus.isPending ? "Atualizando..." : "Confirmar Status"}
            </Button>
          </div>
        </div>
      </SheetContent>"""

new_ui = """                <SelectValue placeholder="Status do Pedido" />
              </SelectTrigger>
              <SelectContent>
                {allStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {orderStatusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="text-xs text-muted-foreground mt-3 mb-1 block">Alterar Pagamento</Label>
            <Select
              value={newPaymentStatus}
              onValueChange={(val: any) => setNewPaymentStatus(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status de Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pendente</SelectItem>
                <SelectItem value="Paid">Pago</SelectItem>
                <SelectItem value="Failed">Falhou</SelectItem>
                <SelectItem value="Refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="w-full mt-3"
              onClick={handleUpdateStatus}
              disabled={(!newStatus && !newPaymentStatus) || updateStatus.isPending}
            >
              {updateStatus.isPending ? "Atualizando..." : "Confirmar Alteraes"}
            </Button>
          </div>
        </div>
      </SheetContent>"""

content = content.replace(old_ui, new_ui)

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
