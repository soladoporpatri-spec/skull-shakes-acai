import React from 'react';
import { useAdicionais, useToggleAdicional } from '@/hooks/useAdicionais';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PackageOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdicionaisList() {
  const { data: adicionais, isLoading, isError } = useAdicionais();
  const toggleAdicional = useToggleAdicional();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <PackageOpen className="h-10 w-10 mb-4" />
        <p className="font-medium">Erro ao carregar adicionais</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  if (!adicionais || adicionais.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <p>Nenhum adicional encontrado no banco.</p>
      </div>
    );
  }

  // Group by category
  const grouped = adicionais.reduce((acc, curr) => {
    const cat = curr.categoria || 'Geral';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {} as Record<string, typeof adicionais>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([categoria, items]) => (
        <Card key={categoria}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{categoria}</CardTitle>
            <CardDescription>Gerencie o estoque de {categoria.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{item.nome}</Label>
                    <p className="text-xs text-muted-foreground">R$ {item.precoBase.toFixed(2)}</p>
                  </div>
                  <Switch
                    checked={item.disponivel}
                    onCheckedChange={() => toggleAdicional.mutate(item.id)}
                    disabled={toggleAdicional.isPending}
                    aria-label={Disponibilidade de }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
