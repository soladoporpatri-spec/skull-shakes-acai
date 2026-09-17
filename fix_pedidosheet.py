# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

old_render = r"""              \{pedido\.itens\.map\(\(item, idx\) => \(
                <div
                  key=\{idx\}
                  className="flex justify-between items-center bg-muted/50 p-3 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">
                      \{item\.quantidade\}x
                    </span>
                    <span className="text-sm text-foreground">
                      \{item\.produto\}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    \{formatCurrency\(item\.precoUnitario \* item\.quantidade\)\}
                  </span>
                </div>
              \)\)\}"""

new_render = """              {pedido.itens.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start bg-muted/50 p-3 rounded-md"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">
                        {item.quantidade}x
                      </span>
                      <span className="text-sm text-foreground font-semibold">
                        {item.produto}
                      </span>
                    </div>
                    {item.adicionais && item.adicionais.length > 0 && (
                      <div className="ml-7 text-xs text-muted-foreground">
                        <span className="font-medium">Adicionais: </span>
                        {item.adicionais.join(", ")}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium whitespace-nowrap ml-4">
                    {formatCurrency(item.precoUnitario * item.quantidade)}
                  </span>
                </div>
              ))}"""

content = re.sub(old_render, new_render, content)

with open('skull-shakes-admin/src/components/pedidos/PedidoSheet.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
