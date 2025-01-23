"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/login.schema";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SigninPage() {
  const [message, setMessage] = useState("");
  const { setUser } = useAuthStore(); // Obtener el estado del store de autenticación
  type TypeLogin = z.infer<typeof loginSchema>;

  const form = useForm<TypeLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: TypeLogin) {
    const resp = await fetch("/api/public/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const dataResp = await resp.json();
    if (resp.ok) {
      setUser(dataResp.user);
      return redirect("/dashboard");
    }
    setMessage(dataResp?.message);
  }

  return (
    <div className=" flex justify-center items-center h-screen ">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>This is a login form.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {message && (
                <div>
                  <p role="alert" className=" text-red-500">
                    {message}
                  </p>
                </div>
              )}
              <Button type="submit">Sign in</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Do you don't have an account?{" "}
            <Link className=" text-blue-500 " href="/signup">
              Sign up
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
