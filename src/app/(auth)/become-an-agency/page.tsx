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
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Icons } from "@/components/icons"
import { userService } from "@/services/user-service"
import { useEffect, useState } from "react"
import useAuthStatus from "@/lib/queries/auth-status"
import { InputPassWord } from "@/components/ui/animation-password-input"
import { useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select"
import { turkish_cities } from "@/lib/cities"

const formSchema = z
  .object({
    userName: z.string().min(1, "Adınızı giriniz"),
    name: z.string().min(1, "Adınızı giriniz"),
    surname: z.string().min(1, "Soyadınızı giriniz"),
    email: z.string().email("Geçerli bir email giriniz"),
    password: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır"),
    passwordConfirm: z.string().min(6, "Şifreniz en az 6 karakter olmalıdır"),
    agencyName: z.string().min(1, "Agency name is required"),
    address: z.object({
      province: z.string().min(1, "Province is required"),
      district: z.string().min(1, "District is required"),
      extra: z.string().min(1, "Extra is required"),
    }),
    profilePhoto: z.instanceof(File).optional(),
    agencyBio: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"], // Field to highlight
  })

type FormData = z.infer<typeof formSchema>

export default function BecomeAnAgency() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    data: authData,
    isLoading: authDataLoading,
    error: authDataError,
  } = useAuthStatus()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordConfirm: "",
      agencyName: "",
      address: {
        province: "",
        district: "",
        extra: "",
      },
      profilePhoto: undefined,
      agencyBio: "",
    },
  })

  // Get available districts based on selected province
  const selectedProvince = form.watch("address.province")
  const availableDistricts = useMemo(() => {
    if (!selectedProvince) return []
    const city = turkish_cities.find((c) => c.name === selectedProvince)
    return city ? city.counties : []
  }, [selectedProvince])

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      router.push("/sign-in")
    }
  }, [form.formState.isSubmitSuccessful, router])

  async function onSubmit(values: FormData) {
    setError(null)
    setSuccessMessage(null)

    try {
      await userService.beAnAgency(
        values.userName,
        values.name,
        values.surname,
        values.email,
        values.password,
        values.passwordConfirm,
        values.agencyName,
        {
          province: values.address.province,
          district: values.address.district,
          extra: values.address.extra,
        },
        values.profilePhoto,
        values.agencyBio,
        () => {
          setSuccessMessage("Agency registration successful!")
        },
        (errorMessage) => {
          setError(errorMessage)
        }
      )
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="absolute left-5 top-5">
        <Link href={authData?.isAuthenticated ? "/dashboard/profile" : "/"}>
          <Icons.arrowLeft strokeWidth={"1.3px"} />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="my-16 w-full max-w-md sm:max-w-3xl">
            <CardHeader>
              <CardTitle>Become an Agency</CardTitle>
              <CardDescription>
                Please fill in the required information to register your agency.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex w-full flex-col gap-6 p-4 sm:flex-row">
              <div className="flex w-full flex-col gap-6 pb-4">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
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
                      <FormItem className="w-full">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter surname" {...field} />
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
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
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
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputPassWord
                          placeholder="Enter your password"
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
                    <FormItem className="w-full">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* second section */}
              <div className="flex w-auto w-full flex-col gap-6 pb-4">
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your agency name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full items-center justify-center gap-4">
                  <FormField
                    control={form.control}
                    name="address.province"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full gap-2">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Provinces</SelectLabel>
                                {turkish_cities.map((province) => (
                                  <SelectItem
                                    key={province.name}
                                    value={province.name}
                                  >
                                    {capitalizeWords(province.name)}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.district"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!selectedProvince}
                          >
                            <SelectTrigger className="w-full gap-2">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Districts</SelectLabel>
                                {availableDistricts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {capitalizeWords(district)}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full items-center justify-center gap-4">
                  <FormField
                    control={form.control}
                    name="address.extra"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Extra</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Profile Photo</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencyBio"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Agency Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-[232px] resize-none"
                          placeholder="Enter agency bio"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4">
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </div>

                <div className="flex w-full justify-center gap-2">
                  <p>Already have an account?</p>
                  <Link href={"/sign-in"} className="underline">
                    Sign In
                  </Link>
                </div>
                {error && <p className="text-center text-red-500">{error}</p>}
                {successMessage && (
                  <p className="text-center text-green-500">{successMessage}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
