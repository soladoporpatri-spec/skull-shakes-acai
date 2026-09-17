# -*- coding: utf-8 -*-
with open('skull-shakes-admin/src/components/produtos/AdicionarProdutoDialog.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add useState and useRef
content = content.replace(
    'import React from "react";',
    'import React, { useState, useRef } from "react";\nimport { toast } from "sonner";\nimport api from "@/lib/api";'
)

# Update schema
content = content.replace(
    'urlImagem: z.string().url("URL inválida").or(z.literal("")),',
    'urlImagem: z.string().optional(),'
)
content = content.replace(
    'urlImagem: z.string().url("URL invǭlida").or(z.literal("")),',
    'urlImagem: z.string().optional(),'
)
content = content.replace(
    'urlImagem: z.string().url("URL invlida").or(z.literal("")),',
    'urlImagem: z.string().optional(),'
)

# Component State
content = content.replace(
    '''export default function AdicionarProdutoDialog({
  open,
  onOpenChange,
}: AdicionarProdutoDialogProps) {
  const createProduto = useCreateProduto();''',
    '''export default function AdicionarProdutoDialog({
  open,
  onOpenChange,
}: AdicionarProdutoDialogProps) {
  const createProduto = useCreateProduto();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);'''
)

# onSubmit Logic
content = content.replace(
    '''  const onSubmit = (data: FormData) => {
    createProduto.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };''',
    '''  const onSubmit = async (data: FormData) => {
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
  };'''
)

# Input Field
content = content.replace(
    '''            <div className="space-y-2">
              <Label htmlFor="urlImagem">URL da Imagem</Label>
              <Input
                id="urlImagem"
                type="url"
                {...register("urlImagem")}
                placeholder="https://exemplo.com/imagem.jpg"
                aria-label="URL da imagem do produto"
              />
              {errors.urlImagem && (
                <p className="text-sm text-destructive">
                  {errors.urlImagem.message}
                </p>
              )}
            </div>''',
    '''            <div className="space-y-2">
              <Label htmlFor="urlImagem">Imagem do Produto</Label>
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
            </div>'''
)

# Button Text
content = content.replace(
    '''            <Button
              type="submit"
              disabled={createProduto.isPending}
              aria-label="Criar produto"
            >
              {createProduto.isPending ? "Criando..." : "Criar Produto"}
            </Button>''',
    '''            <Button
              type="submit"
              disabled={createProduto.isPending || uploading}
              aria-label="Criar produto"
            >
              {uploading ? "Fazendo upload..." : createProduto.isPending ? "Criando..." : "Criar Produto"}
            </Button>'''
)

with open('skull-shakes-admin/src/components/produtos/AdicionarProdutoDialog.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
