"use client";



import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "sonner";

import { useState, useEffect } from "react";

import { useAuthStore } from "@/store/authStore";



function AuthHydration({ children }: { children: React.ReactNode }) {

  const hydrate = useAuthStore((s) => s.hydrate);

  const hydrated = useAuthStore((s) => s.hydrated);



  useEffect(() => {

    hydrate();

  }, [hydrate]);



  if (!hydrated) {

    return (

      <div className="flex h-screen items-center justify-center bg-background">

        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />

      </div>

    );

  }



  return <>{children}</>;

}



export function Providers({ children }: { children: React.ReactNode }) {

  const [queryClient] = useState(

    () =>

      new QueryClient({

        defaultOptions: {

          queries: {

            staleTime: 60 * 1000,

            retry: 1,

            refetchOnWindowFocus: false,

          },

        },

      })

  );



  return (

    <QueryClientProvider client={queryClient}>

      <AuthHydration>

        {children}

        <Toaster

          theme="dark"

          position="top-right"

          richColors

          toastOptions={{

            style: {

              background: "#111111",

              border: "1px solid #1f1f1f",

              color: "#f5f5f5",

            },

          }}

        />

      </AuthHydration>

    </QueryClientProvider>

  );

}
