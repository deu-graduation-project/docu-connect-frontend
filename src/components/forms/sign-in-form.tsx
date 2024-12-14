"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import authService from "@/services/auth";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserAuthService } from "@/services/user";

const formSchema = z.object({
  email: z.string(),
  password: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır"),
});

type FormData = z.infer<typeof formSchema>;

export default function SignInForm() {
  const userAuthService = UserAuthService();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      await userAuthService.login(values.email, values.password, () => {
        authService.identityCheck();
        router.push("/dashboard"); // Ana sayfaya yönlendir
      });
    } catch (error) {
      console.error("Login failed", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href={"/"}>
          <Icons.arrowLeft strokeWidth={"1.3px"} />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Giriş Yapınız</CardTitle>
              <CardDescription>
                Uygun boşlukları doldurup giriş yapınız
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emailinizi Giriniz</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                    <div className="flex w-full justify-between">
                      <FormLabel>Şifrenizi Giriniz</FormLabel>
                      <Link href={"#"} className="text-sm">
                        Şifremi Unuttum?
                      </Link>
                    </div>
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
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Giriş Yap
                </Button>
                <Button
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full"
                  )}
                >
                  <Icons.google />
                  Google İle Giriş Yap
                </Button>
              </div>
              <div className="flex w-full gap-2 justify-center">
                <p>Hesabınız yok mu?</p>
                <Link href={"/sign-up"} className="underline">
                  Kayıt Ol
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
