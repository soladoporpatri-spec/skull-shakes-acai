import React from "react";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Produto } from "@/types";

import { formatCurrency } from "@/lib/formatters";



interface ProdutoCardProps {

  produto: Produto;

  onAlterarPreco: (produto: Produto) => void;

}



export default function ProdutoCard({ produto, onAlterarPreco }: ProdutoCardProps) {

  return (

    <Card className="overflow-hidden group cursor-pointer hover:border-accent/50 transition-colors">

      <div className="relative h-48 w-full bg-muted">

        {produto.urlImagem ? (

          <Image

            src={produto.urlImagem}

            alt={produto.nome}

            fill

            className="object-cover"

            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

          />

        ) : (

          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">

            Sem imagem

          </div>

        )}

        <div className="absolute top-2 right-2">

          <Badge variant={produto.disponivel ? "success" : "destructive"}>

            {produto.disponivel ? "Disponível" : "Indisponível"}

          </Badge>

        </div>

      </div>

      <CardContent className="p-4 space-y-2">

        <h3 className="font-semibold text-sm">{produto.nome}</h3>

        <p className="text-xs text-muted-foreground line-clamp-2">

          {produto.descricao}

        </p>

        <div className="flex items-center justify-between pt-2">

          <span className="text-lg font-bold text-accent">

            {formatCurrency(produto.precoBase)}

          </span>

          <button

            onClick={() => onAlterarPreco(produto)}

            className="text-xs text-accent hover:text-accent/80 underline underline-offset-2 transition-colors"

            aria-label={`Alterar preço de ${produto.nome}`}

          >

            Alterar preço

          </button>

        </div>

      </CardContent>

    </Card>

  );

}
