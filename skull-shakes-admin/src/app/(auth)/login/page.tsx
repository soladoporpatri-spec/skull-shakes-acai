"use client";



import React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { useLogin } from "@/hooks/useAuth";

import { Skull } from "lucide-react";



const loginSchema = z.object({

  username: z.string().min(1, "Usuário é obrigatório"),

  password: z.string().min(1, "Senha é obrigatória"),

});



type LoginForm = z.infer<typeof loginSchema>;



export default function LoginPage() {

  const login = useLogin();

  const {

    register,

    handleSubmit,

    formState: { errors },

  } = useForm<LoginForm>({

    resolver: zodResolver(loginSchema),

  });



  const onSubmit = (data: LoginForm) => {

    login.mutate(data);

  };



  return (

    <div className="flex min-h-screen items-center justify-center bg-background px-4">

      <Card className="w-full max-w-md border-border">

        <CardHeader className="text-center space-y-4">

          <div className="flex justify-center">

            <div className="flex items-center gap-2">

              <Skull className="h-10 w-10 text-accent" />

            </div>

          </div>

          <CardTitle className="text-2xl font-bold">Skull Shakes</CardTitle>

          <p className="text-sm text-muted-foreground">

            Painel Administrativo

          </p>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-2">

              <Label htmlFor="username">Usuário</Label>

              <Input

                id="username"

                type="text"

                autoComplete="username"

                placeholder="Seu usuário"

                {...register("username")}

                aria-label="Nome de usuário"

              />

              {errors.username && (

                <p className="text-sm text-destructive">

                  {errors.username.message}

                </p>

              )}

            </div>



            <div className="space-y-2">

              <Label htmlFor="password">Senha</Label>

              <Input

                id="password"

                type="password"

                autoComplete="current-password"

                placeholder="Sua senha"

                {...register("password")}

                aria-label="Senha"

              />

              {errors.password && (

                <p className="text-sm text-destructive">

                  {errors.password.message}

                </p>

              )}

            </div>



            <Button

              type="submit"

              className="w-full"

              disabled={login.isPending}

              aria-label="Entrar no sistema"

            >

              {login.isPending ? "Entrando..." : "Entrar"}

            </Button>

          </form>

        </CardContent>

      </Card>

    </div>

  );

}
