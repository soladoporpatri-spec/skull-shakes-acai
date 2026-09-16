"use client";



import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import axios from "axios";

import { useAuthStore } from "@/store/authStore";

import { AuthTokens, LoginCredentials } from "@/types";

import { getRefreshToken } from "@/lib/auth";



const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5210";



export function useLogin() {

  const setAuth = useAuthStore((s) => s.setAuth);

  const router = useRouter();



  return useMutation({

    mutationFn: async (credentials: LoginCredentials) => {

      const response = await axios.post<AuthTokens>(

        `${API_URL}/admin/auth/login`,

        credentials

      );

      return response.data;

    },

    onSuccess: (data) => {

      setAuth(data);

      toast.success("Login realizado com sucesso!");

      router.push("/dashboard");

    },

    onError: () => {

      toast.error("Credenciais inválidas");

    },

  });

}



export function useLogout() {

  const clear = useAuthStore((s) => s.clear);

  const router = useRouter();



  return useMutation({

    mutationFn: async () => {

      const refreshToken = getRefreshToken();

      if (refreshToken) {

        await axios

          .post(`${API_URL}/admin/auth/logout`, { refreshToken })

          .catch(() => {

            // Ignora erro de logout

          });

      }

    },

    onSettled: () => {

      clear();

      router.replace("/login");

    },

  });

}
