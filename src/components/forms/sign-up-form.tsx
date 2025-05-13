"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card"
import { Input } from "@/components/ui/input" // DİKKAT: InputPassWord yerine Input kullanıldı
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { userService } from "@/services/user-service"
import { useState } from "react"
import { User } from "@/types/classes"

const formSchema = z
  .object({
    userName: z.string().min(1, "Enter your username"),
    name: z.string().min(1, "Enter your name"),
    surname: z.string().min(1, "Enter your surname"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((fields) => fields.password === fields.passwordConfirm, {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  })

type FormData = z.infer<typeof formSchema>

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
  })

  async function onSubmit(values: FormData) {
    setError(null)
    setSuccessMessage(null)

    const userPayload: User = {
      userName: values.userName,
      name: `${values.name} ${values.surname}`,
      surname: values.surname,
      email: values.email,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    }

    try {
      await userService.createUser(
        userPayload,
        () => setSuccessMessage("User account successfully created!"),
        (errorMessage) => setError(errorMessage)
      )
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("Unexpected error. Try again later.")
    }
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
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Fill your details to create an account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
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
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="Surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@example.com" {...field} />
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
                      <Input type="password" placeholder="Password" {...field} />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </div>
              <div className="flex w-full justify-center gap-2">
                <p>Already have an account?</p>
                <Link href={"/sign-in"} className="underline">
                  Sign in
                </Link>
              </div>
              {error && <p className="text-center text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-center text-green-500">{successMessage}</p>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}