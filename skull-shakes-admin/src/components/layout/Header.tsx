"use client";



import React from "react";

import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { useStoreStatus, useUpdateStoreStatus } from "@/hooks/useStoreStatus";
import { OrderNotifier } from "@/components/pedidos/OrderNotifier";



const pageTitles: Record<string, string> = {

  "/dashboard": "Dashboard",

  "/pedidos": "Pedidos",

  "/produtos": "Produtos",

};



interface HeaderProps {

  onMenuClick: () => void;

}



export default function Header({ onMenuClick }: HeaderProps) {

  const pathname = usePathname();

  const title = pageTitles[pathname] || "Dashboard";
  const { data: status, isLoading } = useStoreStatus();
  const updateStatus = useUpdateStoreStatus();
  
  const handleToggle = () => {
    if (status) {
      updateStatus.mutate(!status.isAberta);
    }
  };



  return (

    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">

      <Button

        variant="ghost"

        size="icon"

        className="lg:hidden"

        onClick={onMenuClick}

        aria-label="Abrir menu de navegação"

      >

        <Menu className="h-5 w-5" />

      </Button>

      <div>

        <h1 className="text-lg font-semibold text-foreground">{title}</h1>

        <p className="text-xs text-muted-foreground">

          Skull Shakes Admin / {title}

        </p>

      </div>

    </header>

  );

}
