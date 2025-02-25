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
} from "@/components/ui/card";
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
  });

type FormData = z.infer<typeof formSchema>;

export default function BecomeAnAgency() {
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
      agencyName: "",
      address: {
        province: "",
        district: "",
        extra: "",
      },
      profilePhoto: undefined,
      agencyBio: "",
    },
  });

  async function onSubmit(values: FormData) {
    setError(null);
    setSuccessMessage(null);

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
          setSuccessMessage("Agency registration successful!");
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
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href={"/"}>
          <Icons.arrowLeft strokeWidth={"1.3px"} />
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="w-full my-16 max-w-md sm:max-w-3xl">
            <CardHeader>
              <CardTitle>Become an Agency</CardTitle>
              <CardDescription>
                Please fill in the required information to register your agency.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex  w-full flex-col sm:flex-row  gap-6">
              <div className="w-full pb-4 gap-6 flex flex-col ">
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
                <div className="flex gap-4 items-center">
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
              <div className="w-full pb-4 gap-6 flex flex-col w-auto">
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
                <div className="flex items-center justify-center w-full  gap-4">
                  <FormField
                    control={form.control}
                    name="address.province"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street" {...field} />
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
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-center w-full  gap-4">
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
                        <Input placeholder="Enter agency bio" {...field} />
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

                <div className="flex w-full gap-2 justify-center">
                  <p>Already have an account?</p>
                  <Link href={"/sign-in"} className="underline">
                    Sign In
                  </Link>
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {successMessage && (
                  <p className="text-green-500 text-center">{successMessage}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
