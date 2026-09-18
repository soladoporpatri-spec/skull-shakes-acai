"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

const diasSemana = [
  { id: "0", label: "Domingo" },
  { id: "1", label: "Segunda-feira" },
  { id: "2", label: "Terça-feira" },
  { id: "3", label: "Quarta-feira" },
  { id: "4", label: "Quinta-feira" },
  { id: "5", label: "Sexta-feira" },
  { id: "6", label: "Sábado" },
];

export default function ConfiguracoesPage() {
  const [useAuto, setUseAuto] = useState(false);
  const [schedule, setSchedule] = useState<Record<string, { open: string; close: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/admin/configuracoes');
        setUseAuto(data.useAutoSchedule);
        if (data.scheduleJson) {
          setSchedule(JSON.parse(data.scheduleJson));
        }
      } catch (err) {
        toast.error("Erro ao carregar configurações");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleTimeChange = (diaId: string, type: "open" | "close", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        [type]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/configuracoes', {
        useAutoSchedule: useAuto,
        scheduleJson: JSON.stringify(schedule)
      });
      toast.success("Configurações salvas com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10">Carregando...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horário de Funcionamento</CardTitle>
          <CardDescription>
            Configure quando a loja deve ligar e desligar automaticamente no site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border p-4 rounded-lg bg-card">
            <div className="space-y-0.5">
              <Label className="text-base">Ativar Horário Automático</Label>
              <p className="text-sm text-muted-foreground">
                Se desligado, você precisa abrir e fechar a loja manualmente pelo botão no topo.
              </p>
            </div>
            <Switch
              checked={useAuto}
              onCheckedChange={setUseAuto}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Agenda Semanal</h3>
            {diasSemana.map((dia) => (
              <div key={dia.id} className="flex items-center gap-4">
                <Label className="w-32">{dia.label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    className="w-32"
                    value={schedule[dia.id]?.open || ""}
                    onChange={(e) => handleTimeChange(dia.id, "open", e.target.value)}
                  />
                  <span>até</span>
                  <Input
                    type="time"
                    className="w-32"
                    value={schedule[dia.id]?.close || ""}
                    onChange={(e) => handleTimeChange(dia.id, "close", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
