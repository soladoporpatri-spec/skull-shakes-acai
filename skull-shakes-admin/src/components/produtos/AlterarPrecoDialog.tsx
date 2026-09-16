"use client";



import React from "react";

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

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { Produto } from "@/types";

import { useUpdatePreco } from "@/hooks/useProdutos";

import { formatCurrency } from "@/lib/formatters";



const schema = z.object({

  novoPreco: z

    .number({ invalid_type_error: "Informe um número válido" })

    .positive("O preço deve ser maior que zero"),

});



type FormData = z.infer<typeof schema>;



interface AlterarPrecoDialogProps {

  produto: Produto | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;

}



export default function AlterarPrecoDialog({

  produto,

  open,

  onOpenChange,

}: AlterarPrecoDialogProps) {

  const updatePreco = useUpdatePreco();

  const {

    register,

    handleSubmit,

    reset,

    formState: { errors },

  } = useForm<FormData>({

    resolver: zodResolver(schema),

    defaultValues: { novoPreco: produto?.precoBase ?? 0 },

  });



  React.useEffect(() => {

    if (produto) {

      reset({ novoPreco: produto.precoBase });

    }

  }, [produto, reset]);



  if (!produto) return null;



  const onSubmit = (data: FormData) => {

    updatePreco.mutate(

      { id: produto.id, novoPreco: data.novoPreco },

      {

        onSuccess: () => {

          onOpenChange(false);

        },

      }

    );

  };



  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>

        <DialogHeader>

          <DialogTitle>Alterar Preço</DialogTitle>

          <DialogDescription>

            Produto: <strong>{produto.nome}</strong> — Preço atual:{" "}

            <strong>{formatCurrency(produto.precoBase)}</strong>

          </DialogDescription>

        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="space-y-4">

            <div className="space-y-2">

              <Label htmlFor="novoPreco">Novo Preço (R$)</Label>

              <Input

                id="novoPreco"

                type="number"

                step="0.01"

                min="0.01"

                {...register("novoPreco", { valueAsNumber: true })}

                aria-label="Novo preço do produto"

              />

              {errors.novoPreco && (

                <p className="text-sm text-destructive">

                  {errors.novoPreco.message}

                </p>

              )}

            </div>

          </div>

          <DialogFooter className="mt-6">

            <Button

              type="button"

              variant="outline"

              onClick={() => onOpenChange(false)}

              aria-label="Cancelar alteração de preço"

            >

              Cancelar

            </Button>

            <Button

              type="submit"

              disabled={updatePreco.isPending}

              aria-label="Confirmar alteração de preço"

            >

              {updatePreco.isPending ? "Salvando..." : "Salvar"}

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>

  );

}
