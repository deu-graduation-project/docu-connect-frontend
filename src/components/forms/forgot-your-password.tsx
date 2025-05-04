"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import Link from "next/link"
import { UserAuthService } from "@/services/user-auth-service"
import { useMutation } from "@tanstack/react-query"

const formSchema = z.object({
  emailOrUserName: z.string().min(1, "Email veya kullanıcı adı gereklidir."),
})

type FormData = z.infer<typeof formSchema>

export default function ForgotYourPassword() {
  const { toast } = useToast()
  const userAuthService = UserAuthService()
  const [isResetSent, setIsResetSent] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUserName: "",
    },
  })

  const resetMutation = useMutation({
    mutationFn: async (values: FormData): Promise<void> => {
      return userAuthService.passwordReset(values.emailOrUserName)
    },
    onSuccess: () => {
      setIsResetSent(true)
      toast({
        title: "Şifre sıfırlama bağlantısı gönderildi",
        description:
          "E-posta adresinize bir şifre sıfırlama bağlantısı gönderdik.",
      })
    },
    onError: (error) => {
      console.error("Password reset failed:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description:
          error instanceof Error
            ? error.message
            : "Şifre sıfırlama işlemi başarısız oldu.",
      })
    },
  })

  async function onSubmit(values: FormData) {
    resetMutation.mutate(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="absolute left-5 top-5">
        <Link href={"/sign-in"}>
          <Icons.arrowLeft strokeWidth={"1.3px"} />
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Şifrenizi mi unuttunuz?</CardTitle>
              <CardDescription>
                E-posta adresinizi veya kullanıcı adınızı girin, size şifre
                sıfırlama bağlantısı gönderelim
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-4">
              {!isResetSent ? (
                <>
                  <FormField
                    control={form.control}
                    name="emailOrUserName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email veya Kullanıcı Adı</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Email veya kullanıcı adınızı giriniz"
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
                      disabled={resetMutation.isPending}
                    >
                      {resetMutation.isPending ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                      ) : (
                        "Şifre Sıfırlama Bağlantısı Gönder"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <Icons.check className="h-10 w-10 text-green-500" />
                  <p>
                    Şifre sıfırlama bağlantısı gönderildi. Lütfen e-posta
                    kutunuzu kontrol edin.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setIsResetSent(false)}
                  >
                    Tekrar Dene
                  </Button>
                </div>
              )}
              <div className="flex w-full justify-center gap-2">
                <p>Giriş yapmak mı istiyorsunuz?</p>
                <Link href={"/sign-in"} className="underline">
                  Giriş Yap
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
