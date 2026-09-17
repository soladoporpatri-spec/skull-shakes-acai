# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add imports
content = content.replace('import { Printer } from "lucide-react";', 'import { Printer } from "lucide-react";\nimport { useMotoboys, useUpdatePedidoMotoboy } from "@/hooks/useMotoboys";')

# Update type interface
content = content.replace('export default function PedidoSheet({', """export default function PedidoSheet({""")

# Add hook calls inside component
old_hooks = """  const [newPaymentStatus, setNewPaymentStatus] = useState<"Pending" | "Paid" | "Failed" | "Refunded" | "">("");"""
new_hooks = old_hooks + """
  const { data: motoboys } = useMotoboys();
  const updateMotoboy = useUpdatePedidoMotoboy();
"""
content = content.replace(old_hooks, new_hooks)

# Add UI inside the Sheet
old_ui = """            <Button
              className="w-full mt-3"
              onClick={handleUpdateStatus}
              disabled={(!newStatus && !newPaymentStatus) || updateStatus.isPending}
            >
              {updateStatus.isPending ? "Atualizando..." : "Confirmar Alteraes"}
            </Button>
          </div>
        </div>
      </SheetContent>"""

new_ui = """            <Button
              className="w-full mt-3"
              onClick={handleUpdateStatus}
              disabled={(!newStatus && !newPaymentStatus) || updateStatus.isPending}
            >
              {updateStatus.isPending ? "Atualizando..." : "Confirmar Alterações"}
            </Button>

            {/* Motoboy Assignment */}
            <div className="mt-6 pt-4 border-t">
              <Label className="text-xs text-muted-foreground mb-1 block">Atribuir Entregador</Label>
              <Select
                value={pedido.motoboyId ? pedido.motoboyId.toString() : ""}
                onValueChange={(val: any) => updateMotoboy.mutate({ id: pedido.id, motoboyId: val === "none" ? null : parseInt(val) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o Motoboy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {motoboys?.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </SheetContent>"""

content = content.replace(old_ui, new_ui)

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
