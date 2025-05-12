"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UserAuthService } from "@/services/user-auth-service"

const formSchema = z.object({
  email: z.string().email("Email is wrong."),
  password: z.string().min(6, "Password is wrong."),
})

type FormData = z.infer<typeof formSchema>

export default function SignInForm() {
  const userAuthService = UserAuthService()
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (values: FormData): Promise<unknown> => {
      return userAuthService.login(values.email, values.password)
    },
    onSuccess: (tokenResponse) => {
      // Invalidate the authStatus query to refetch the authentication state
      queryClient.invalidateQueries({ queryKey: ["authStatus"] })
      // Redirect to the dashboard
      router.push("/dashboard/profile")
    },
    onError: (error) => {
      console.error("Login failed:", error)
      // Display an error message to the user
    },
  })

  async function onSubmit(values: FormData) {
    loginMutation.mutate(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="absolute left-5 top-5">
        <Link href={"/"}>
          <Icons.arrowLeft strokeWidth={"1.3px"} />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Fill necessary spaces
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your email"
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
                      <FormLabel>Password</FormLabel>

                      <Link href={"/forgot-your-password"} className="text-sm">
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
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
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
              <div className="flex w-full justify-center gap-2">
                <p>Don't have an account?</p>
                <Link href={"/sign-up"} className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
