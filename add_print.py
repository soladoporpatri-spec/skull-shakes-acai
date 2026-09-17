# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add Printer icon import
content = content.replace('from "lucide-react";', 'from "lucide-react";\nimport { Printer } from "lucide-react";')

# Add "Imprimir" function
print_func = """  const handlePrint = () => {
    window.print();
  };

  if (!pedido) return null;"""

content = content.replace("  if (!pedido) return null;", print_func)

# Add "Imprimir" button next to close button or near title
header = """        <SheetHeader>
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
        </SheetHeader>"""

# Using regex to replace SheetHeader
content = re.sub(r'<SheetHeader>[\s\S]*?</SheetHeader>', header, content, count=1)

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
