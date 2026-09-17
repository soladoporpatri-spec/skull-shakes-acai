# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Update MapGet("/pedidos") query
old_query = """            var pedidos = await db.Pedidos
                .Include(p => p.Itens).ThenInclude(i => i.Produto)
                .OrderByDescending(p => p.DataPedido)
                .Select(p => new
                {
                    p.Id, p.NomeCliente, p.Telefone, p.Endereco, p.DataPedido,
                    StatusPedido = p.StatusPedido.ToString(),
                    StatusPagamento = p.StatusPagamento.ToString(),
                    FormaPagamento = p.FormaPagamento.ToString(),
                    p.Subtotal, p.DeliveryFee, p.Total, p.PagamentoExternoId,
                    Itens = p.Itens.Select(i => new { i.Quantidade, i.PrecoUnitario, Produto = i.Produto != null ? i.Produto.Nome : "N/A" })
                }).ToListAsync();"""

new_query = """            var pedidos = await db.Pedidos
                .Include(p => p.Itens).ThenInclude(i => i.Produto)
                .Include(p => p.Itens).ThenInclude(i => i.Adicionais)
                .OrderByDescending(p => p.DataPedido)
                .Select(p => new
                {
                    p.Id, p.NomeCliente, p.Telefone, p.Endereco, p.DataPedido,
                    StatusPedido = p.StatusPedido.ToString(),
                    StatusPagamento = p.StatusPagamento.ToString(),
                    FormaPagamento = p.FormaPagamento.ToString(),
                    p.Subtotal, p.DeliveryFee, p.Total, p.PagamentoExternoId,
                    Itens = p.Itens.Select(i => new { 
                        i.Quantidade, 
                        i.PrecoUnitario, 
                        Produto = i.Produto != null ? i.Produto.Nome : "N/A",
                        Adicionais = i.Adicionais.Select(a => a.Nome).ToList()
                    })
                }).ToListAsync();"""

content = content.replace(old_query, new_query)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
