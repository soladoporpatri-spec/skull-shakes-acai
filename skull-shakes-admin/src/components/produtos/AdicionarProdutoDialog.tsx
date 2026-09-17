"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateProduto } from "@/hooks/useProdutos";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  precoBase: z
    .number({ invalid_type_error: "Informe um número válido" })
    .positive("O preço deve ser maior que zero"),
  urlImagem: z.string().optional(),
  disponivel: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface AdicionarProdutoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdicionarProdutoDialog({
  open,
  onOpenChange,
}: AdicionarProdutoDialogProps) {
  const createProduto = useCreateProduto();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      descricao: "",
      precoBase: 0,
      urlImagem: "",
      disponivel: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    let finalUrl = data.urlImagem || "";
    if (file) {
      setUploading(true);
      try {
        const formData = new window.FormData();
        formData.append("file", file);
        const res = await api.post("/admin/produtos/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalUrl = res.data.url;
      } catch (err) {
        toast.error("Erro ao fazer upload da imagem");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    createProduto.mutate({ ...data, urlImagem: finalUrl }, {
      onSuccess: () => {
        reset();
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo produto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                {...register("nome")}
                aria-label="Nome do produto"
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                {...register("descricao")}
                aria-label="Descrição do produto"
              />
              {errors.descricao && (
                <p className="text-sm text-destructive">
                  {errors.descricao.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoBase">Preço Base (R$)</Label>
              <Input
                id="precoBase"
                type="number"
                step="0.01"
                min="0.01"
                {...register("precoBase", { valueAsNumber: true })}
                aria-label="Preço base do produto"
              />
              {errors.precoBase && (
                <p className="text-sm text-destructive">
                  {errors.precoBase.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urlImagem">Imagem do Produto (Upload)</Label>
              <Input
                id="urlImagem"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
                aria-label="Upload de imagem"
              />
              {file && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <span>Arquivo selecionado: {file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); if(fileInputRef.current) fileInputRef.current.value=''; }}>Remover</Button>
                </div>
              )}
              {errors.urlImagem && (
                <p className="text-sm text-destructive">
                  {errors.urlImagem.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="disponivel"
                type="checkbox"
                {...register("disponivel")}
                className="h-4 w-4 rounded border-input"
                aria-label="Produto disponível"
              />
              <Label htmlFor="disponivel">Disponível</Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              aria-label="Cancelar criação de produto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createProduto.isPending || uploading}
              aria-label="Criar produto"
            >
              {uploading ? "Fazendo upload..." : createProduto.isPending ? "Criando..." : "Criar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
