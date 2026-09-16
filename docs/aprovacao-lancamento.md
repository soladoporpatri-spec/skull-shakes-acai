# Aprovação de lançamento — Skull Shakes

Atualizado em 16/09/2026. Esta página registra os dados confirmados pelo responsável e o que ainda impede receber pedidos pelo site.

| Item | Situação | Fonte |
| --- | --- | --- |
| Cardápio, preços e adicionais | Confirmados | `imagens/Cardapio.jpeg` e confirmação do responsável |
| Horário | 13h às 22h; dias da semana não especificados | Cardápio e confirmação do responsável |
| WhatsApp e Instagram | 62 99883-2935; @skullshakes | Cardápio e confirmação do responsável |
| Origem da entrega | CEP 75090-465, quadra 14, lote 25 | Responsável |
| Cobertura | Toda a cidade de Anápolis | Responsável |
| Taxa | R$ 1 por km de trajeto por ruas; sem taxa mínima e sem pedido mínimo | Responsável |
| PIX e cartão | Pendente: confirmar se cada modalidade é cobrada online ou na entrega | Responsável |
| Cálculo da rota | Pendente: integrar serviço de rotas e validar valor no servidor | Implementação |
| Envio do pedido | Pendente: API funcional, persistência e confirmação real | Implementação |
| Compilação do backend | Bloqueada por 26 erros de sintaxe em `Backend/Modelos/Produto.cs` e `Adicional.cs` | `dotnet build Backend/SkullShakes.Api.csproj --no-restore` |

O site usa `web/src/config/store.ts` para os dados comerciais exibidos. Ao integrar o backend, ele deve consumir a mesma configuração ou assumir a autoridade e fornecer esses dados ao site, sem manter cópias manuais divergentes. A taxa exibida ao cliente deve ser calculada a partir de rota por ruas e conferida no servidor antes da confirmação.

Para aprovar o lançamento, o backend deve compilar e persistir pedidos. Execute `npm run build`, `npm run lint`, `npm run test:e2e` e `npm run test:launch` dentro de `web/`. O último comando deve passar nos projetos `mobile` e `desktop` com um pedido de teste identificado por resposta da API; confirme também a persistência em teste de integração do backend. Enquanto falhar, o checkout não deve permitir confirmar pedidos nem anunciar sucesso.

## Arquivos desta etapa

- Dados e regras: `web/src/config/store.ts`.
- Site e navegação: `web/src/app/page.tsx`, `layout.tsx`, `globals.css`, `web/src/components/ui/CartButton.tsx` e `MenuItemCard.tsx`.
- Pedido: `web/src/components/checkout/CheckoutAddress.tsx`, `CheckoutSection.tsx`, `OrderSummary.tsx`, `PaymentMethod.tsx`, `web/src/hooks/useCheckout.ts`, `web/src/lib/address.ts` e `web/src/store/cartStore.ts`.
- Testes e execução: `web/tests/purchase-path.spec.ts`, `launch-approval.spec.ts`, `web/playwright.config.ts`, `web/package.json`, `package-lock.json`, `next.config.ts` e `.gitignore`.
- Documentação: este arquivo e `docs/superpowers/plans/2026-09-16-regras-loja-lancamento.md`.
