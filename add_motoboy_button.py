# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/app/(admin)/fechamento/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# We will just add a link/button that triggers a prompt, or we can make a simple useMutation inline.
new_imports = 'import { Bike, DollarSign, CreditCard, Plus } from "lucide-react";\\nimport { useMutation, useQueryClient } from "@tanstack/react-query";\\nimport { toast } from "sonner";\\nimport api from "@/lib/api";'

content = content.replace('import { Bike, DollarSign, CreditCard } from "lucide-react";', new_imports)

inline_hook = """  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { data, isLoading, isError } = useFechamento(date);
  const queryClient = useQueryClient();

  const addMotoboy = useMutation({
    mutationFn: async (nome: string) => {
      await api.post('/admin/motoboys', { nome, telefone: '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
      toast.success('Motoboy adicionado!');
    }
  });

  const handleAddMotoboy = () => {
    const nome = window.prompt("Nome do novo motoboy:");
    if (nome) {
      addMotoboy.mutate(nome);
    }
  };"""

content = content.replace("""  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { data, isLoading, isError } = useFechamento(date);""", inline_hook)

ui_button = """        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleAddMotoboy}><Plus className="h-4 w-4 mr-2" /> Motoboy</Button>
          <Input """

content = content.replace("""        <div className="flex items-center gap-2">
          <Input """, ui_button)

with open('skull-shakes-admin/src/app/(admin)/fechamento/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
