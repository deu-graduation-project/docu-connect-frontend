"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { userService } from "@/services/user-service";
import { useState } from "react";
import { User } from "@/types/classes";

const formSchema = z
  .object({
    userName: z.string().min(1, "Adınızı giriniz"),
    name: z.string().min(1, "Adınızı giriniz"),
    surname: z.string().min(1, "Soyadınızı giriniz"),
    email: z.string().email("Geçerli bir email giriniz"),
    password: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır"),
    passwordConfirm: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"], // Field to highlight
  });

type FormData = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: FormData) {
    setError(null);
    setSuccessMessage(null);

    const userPayload: User = {
      userName: values.userName,
      name: `${values.name} ${values.surname}`,
      surname: values.surname,
      email: values.email,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    };

    try {
      await userService.createUser(
        userPayload,
        (data) => {
          setSuccessMessage(`Kullanıcı başarıyla oluşturuldu!`);
        },
        (errorMessage) => {
          setError(errorMessage);
        }
      );
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div></div>
      <div className="absolute top-5 left-5">
        <Link href={"/"}>
          <Icons.arrowLeft strokeWidth={"1.3px"} />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Kayıt Ol</CardTitle>
              <CardDescription>
                Lütfen bilgilerinizi doldurup kayıt olun
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Adınızı giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adınızı Giriniz</FormLabel>
                    <FormControl>
                      <Input placeholder="Adınızı giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyadınızı Giriniz</FormLabel>
                    <FormControl>
                      <Input placeholder="Soyadınızı giriniz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emailinizi Giriniz</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Emailinizi giriniz"
                        {...field}
                      />
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
                    <FormLabel>Şifrenizi Giriniz</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Şifrenizi giriniz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifrenizi Tekrar Giriniz</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Şifrenizi tekrar giriniz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Kayıt Ol
                </Button>
                <Button
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full"
                  )}
                >
                  <Icons.google />
                  Google ile Kayıt Ol
                </Button>
              </div>
              <div className="flex w-full gap-2 justify-center">
                <p>Hesabınız var mı?</p>
                <Link href={"/sign-in"} className="underline">
                  Giriş Yap
                </Link>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
