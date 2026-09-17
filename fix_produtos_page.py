# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/app/(admin)/produtos/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Imports
content = content.replace('import { Plus, PackageOpen } from "lucide-react";',
"""import { Plus, PackageOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdicionaisList from "@/components/produtos/AdicionaisList";""")

# UI Replace
old_ui = r"""      <div className="flex items-center justify-between">[\s\S]*?<AlterarPrecoDialog"""

new_ui = """      <Tabs defaultValue="produtos" className="w-full">
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

      <AlterarPrecoDialog"""

content = re.sub(old_ui, new_ui, content)

with open('skull-shakes-admin/src/app/(admin)/produtos/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
