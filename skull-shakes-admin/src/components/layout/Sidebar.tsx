"use client";



import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Bike,
  Users,
  Skull
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { useLogout } from "@/hooks/useAuth";



const navItems = [

  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { href: "/pedidos", label: "Pedidos", icon: ShoppingBag },

];



interface SidebarProps {

  onNavigate?: () => void;

}



export default function Sidebar({ onNavigate }: SidebarProps) {

  const pathname = usePathname();

  const logout = useLogout();



  return (

    <div className="flex h-full flex-col bg-surface border-r border-border">

      <div className="flex items-center gap-2 p-6">

        <Skull className="h-7 w-7 text-accent" />

        <span className="text-lg font-bold text-foreground">

          Skull Shakes <span className="text-xs font-normal text-muted-foreground">Admin</span>

        </span>

      </div>



      <nav className="flex-1 space-y-1 px-3">

        {navItems.map((item) => {

          const isActive = pathname === item.href;

          return (

            <Link

              key={item.href}

              href={item.href}

              onClick={onNavigate}

              className={cn(

                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",

                isActive

                  ? "bg-accent/10 text-accent"

                  : "text-muted-foreground hover:bg-muted hover:text-foreground"

              )}

              aria-label={`Navegar para ${item.label}`}

            >

              <item.icon className="h-4 w-4" />

              {item.label}

            </Link>

          );

        })}

      </nav>



      <div className="border-t border-border p-4">

        <Button

          variant="ghost"

          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"

          onClick={() => logout.mutate()}

          disabled={logout.isPending}

          aria-label="Sair do sistema"

        >

          <LogOut className="h-4 w-4" />

          {logout.isPending ? "Saindo..." : "Sair"}

        </Button>

      </div>

    </div>

  );

}
