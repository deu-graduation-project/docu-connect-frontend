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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAuthService } from "@/services/user-auth-service";
import authService from "@/services/auth";

const formSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz."),
  password: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır."),
});

type FormData = z.infer<typeof formSchema>;

export default function SignInForm() {
  const userAuthService = UserAuthService();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: FormData): Promise<unknown> => {
      return userAuthService.login(values.email, values.password);
    },
    onSuccess: (tokenResponse) => {
      // Invalidate the authStatus query to refetch the authentication state
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
      // Redirect to the dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Display an error message to the user
    },
  });

  async function onSubmit(values: FormData) {
    loginMutation.mutate(values);
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Icons.spinner className="w-4 h-4 animate-spin" />
                  ) : (
                    "Giriş Yap"
                  )}
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
