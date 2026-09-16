"use client";



import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

import Sidebar from "@/components/layout/Sidebar";

import Header from "@/components/layout/Header";

import { Sheet, SheetContent } from "@/components/ui/sheet";



export default function AdminLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  const router = useRouter();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const hydrated = useAuthStore((s) => s.hydrated);

  const [mobileOpen, setMobileOpen] = useState(false);



  useEffect(() => {

    if (hydrated && !isAuthenticated) {

      router.replace("/login");

    }

  }, [hydrated, isAuthenticated, router]);



  if (!hydrated) {

    return (

      <div className="flex h-screen items-center justify-center bg-background">

        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />

      </div>

    );

  }



  if (!isAuthenticated) {

    return null;

  }



  return (

    <div className="flex h-screen overflow-hidden bg-background">

      {/* Desktop Sidebar */}

      <aside className="hidden lg:flex lg:w-60 lg:flex-shrink-0">

        <Sidebar />

      </aside>



      {/* Mobile Sidebar */}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>

        <SheetContent side="left" className="w-60 p-0">

          <Sidebar onNavigate={() => setMobileOpen(false)} />

        </SheetContent>

      </Sheet>



      {/* Main content */}

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">

          {children}

        </main>

      </div>

    </div>

  );

}
