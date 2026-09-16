# Regras da loja e aprovação de lançamento — plano de implementação

**Objetivo:** reunir os dados comerciais usados pelo site e impedir que o fluxo de compra anuncie um pedido que não foi enviado.

**Contexto:** o cardápio impresso em `imagens/Cardapio.jpeg` é a única referência comercial encontrada, mas ainda precisa de confirmação. O backend atual não oferece criação de pedidos funcional. Endereço de origem, cobertura, taxa de entrega e modalidade de cobrança não foram informados.

**Decisão de desenho:** manter a identidade visual do site, colocar o acesso ao cardápio antes da garrafa no celular e usar controles explícitos no carrossel. Uma configuração única alimentará cardápio, horários, contato e regras de entrega/pagamento do site. Campos não confirmados permanecem pendentes e impedem a finalização.

## Trabalho

- [x] Criar configuração comercial única para o site e registrar a origem dos dados; remover preços, adicionais, coordenadas e taxas duplicados da interface.
- [x] Tornar horário e contato visíveis; colocar a ação de ver o cardápio na primeira tela do celular e permitir navegação por teclado e zoom.
- [x] Corrigir o checkout para não indicar pagamento ou pedido concluído sem integração real; apresentar valores não confirmados como pendentes.
- [x] Criar testes automatizados de navegação e carrinho em celular e desktop, além de uma checagem que bloqueie a aprovação de lançamento enquanto faltarem regras ou envio real do pedido.
- [x] Executar build, lint dos arquivos alterados e testes; revisar interface renderizada em celular e desktop.

## Critérios de lançamento

O lançamento só pode ser aprovado com cardápio, preços e adicionais conferidos; endereço de origem, área e taxa de entrega definidos; horário e contato confirmados; modalidade de PIX/cartão definida; checkout ligado a uma API que persista o pedido e confirme o resultado; e teste automatizado do pedido completo em celular e desktop. Um teste de carrinho ou uma simulação visual não substitui esse último critério.
