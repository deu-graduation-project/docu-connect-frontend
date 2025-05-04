"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UserAuthService } from "@/services/user-auth-service"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

const formSchema = z
  .object({
    newPassword: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır."),
    confirmPassword: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export default function ResetPasswordForm() {
  const userAuthService = UserAuthService()
  const router = useRouter()
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  // Extract token and userId from URL in client-side
  useEffect(() => {
    // Get the full URL path
    const path = window.location.pathname
    const segments = path.split("/")

    // Find userId and resetToken from URL segments
    // Assuming format like /reset-password/[userId]/[resetToken]
    if (segments.length >= 4) {
      // The last segment should be the resetToken
      const foundResetToken = segments[segments.length - 1]
      // The second-to-last segment should be the userId
      const foundUserId = segments[segments.length - 2]

      setUserId(foundUserId)
      setResetToken(foundResetToken)
    }
  }, [])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Verify the reset token when userId and resetToken are available
  const verifyTokenQuery = useQuery({
    queryKey: ["verifyResetToken", userId, resetToken],
    queryFn: async () => {
      if (!userId || !resetToken) {
        return { state: false }
      }

      try {
        const response = await userAuthService.verifyResetToken(
          resetToken,
          userId
        )
        return response
      } catch (error) {
        console.error("Token verification failed:", error)
        return { state: false }
      }
    },
    enabled: !!userId && !!resetToken,
  })

  useEffect(() => {
    if (verifyTokenQuery.data) {
      setTokenValid(verifyTokenQuery.data.state)
    }
  }, [verifyTokenQuery.data])

  const updatePasswordMutation = useMutation({
    mutationFn: async (values: FormData) => {
      if (!userId || !resetToken) {
        throw new Error("Missing userId or resetToken")
      }

      return userAuthService.updatePassword(
        userId,
        resetToken,
        values.newPassword,
        values.confirmPassword
      )
    },
    onSuccess: (response) => {
      toast({
        title: "Başarılı",
        description: response.message || "Şifreniz başarıyla güncellendi.",
      })
      router.push("/sign-in")
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description:
          error?.message || "Şifre güncelleme işlemi başarısız oldu.",
      })
    },
  })

  async function onSubmit(values: FormData) {
    updatePasswordMutation.mutate(values)
  }

  if (!userId || !resetToken || verifyTokenQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Şifre Sıfırlama</CardTitle>
            <CardDescription>Token doğrulanıyor...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Icons.spinner className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Geçersiz Token</CardTitle>
            <CardDescription>
              Şifre sıfırlama bağlantınız geçersiz veya süresi dolmuş.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                Lütfen yeni bir şifre sıfırlama isteği gönderin.
              </p>
              <Button
                className="w-full"
                onClick={() => router.push("/forgot-your-password")}
              >
                Şifre Sıfırlama Sayfasına Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="absolute left-5 top-5">
        <Link href="/sign-in">
          <Icons.arrowLeft strokeWidth="1.3px" />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Şifre Yenileme</CardTitle>
              <CardDescription>
                Lütfen yeni şifrenizi belirleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yeni Şifre</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Yeni şifrenizi giriniz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre Tekrarı</FormLabel>
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={updatePasswordMutation.isPending}
                >
                  {updatePasswordMutation.isPending ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    "Şifreyi Yenile"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
