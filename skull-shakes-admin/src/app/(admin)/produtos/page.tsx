"use client";



import React, { useState } from "react";

import { useProdutos } from "@/hooks/useProdutos";

import ProdutoCard from "@/components/produtos/ProdutoCard";

import AlterarPrecoDialog from "@/components/produtos/AlterarPrecoDialog";

import AdicionarProdutoDialog from "@/components/produtos/AdicionarProdutoDialog";

import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";

import { Produto } from "@/types";

import { Plus, PackageOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdicionaisList from "@/components/produtos/AdicionaisList";



export default function ProdutosPage() {

  const { data: produtos, isLoading, isError } = useProdutos();

  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

  const [precoDialogOpen, setPrecoDialogOpen] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);



  const handleAlterarPreco = (produto: Produto) => {

    setSelectedProduto(produto);

    setPrecoDialogOpen(true);

  };



  if (isError) {

    return (

      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">

        <PackageOpen className="h-12 w-12 mb-4" />

        <p className="text-lg font-medium">Erro ao carregar produtos</p>

        <p className="text-sm">Verifique se a API está online e tente novamente.</p>

      </div>

    );

  }



  return (

    <div className="space-y-6">

      <Tabs defaultValue="produtos" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="produtos">Aas (Produtos)</TabsTrigger>
            <TabsTrigger value="adicionais">Estoque (Adicionais)</TabsTrigger>
          </TabsList>

          <Button
            onClick={() => setAddDialogOpen(true)}
            aria-label="Adicionar novo produto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        <TabsContent value="produtos" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-t-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : !produtos || produtos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <PackageOpen className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Nenhum produto cadastrado</p>
              <p className="text-sm">Clique em "Adicionar Produto" para comear.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {produtos.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  onAlterarPreco={handleAlterarPreco}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="adicionais" className="mt-0">
          <AdicionaisList />
        </TabsContent>
      </Tabs>

      <AlterarPrecoDialog

        produto={selectedProduto}

        open={precoDialogOpen}

        onOpenChange={setPrecoDialogOpen}

      />



      <AdicionarProdutoDialog

        open={addDialogOpen}

        onOpenChange={setAddDialogOpen}

      />

    </div>

  );

}
