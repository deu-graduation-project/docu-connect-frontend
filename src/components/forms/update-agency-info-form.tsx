import React from "react"
import z from "zod"
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
import { Card, CardContent } from "@/components/ui/card"
import { useQueryClient } from "@tanstack/react-query"
import { userService } from "@/services/user-service"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { UpdateAgencyInfos } from "../../types/classes"
import { Textarea } from "../ui/textarea"

type FormData = z.infer<typeof formSchema>

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  surname: z
    .string()
    .min(3, "Surname must be at least 3 characters")
    .max(100, "Surname must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  agencyName: z
    .string()
    .min(3, "Agency name must be at least 3 characters")
    .max(100, "Agency name must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  province: z
    .string()
    .min(3, "Province must be at least 3 characters")
    .max(100, "Province must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  district: z
    .string()
    .min(3, "District must be at least 3 characters")
    .max(100, "District must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  extra: z
    .string()
    .max(1000, "Extra information must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
  agencyBio: z
    .string()
    .max(2000, "Agency bio must be at most 1200 characters")
    .optional()
    .or(z.literal("")),
  profilePhoto: z.instanceof(File).optional().or(z.literal("")),
})

export default function UpdateAgencyInfoForm() {
  const queryClient = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      agencyName: "",
      province: "",
      district: "",
      extra: "",
      agencyBio: "",
      profilePhoto: undefined,
    },
  })

  const agencyInfoMutation = useMutation({
    mutationFn: async (values: UpdateAgencyInfos): Promise<unknown> => {
      return userService.updateAgencyInfos(values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UpdateAgencyInfos"] })
      toast.success("Agency info updated successfully")
    },
    onError: (error: { message: string }) => {
      toast.error(error.message)
    },
  })

  async function onSubmit(values: FormData) {
    // Filter out empty or undefined fields
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => {
        if (value === null || value === undefined || value === "") {
          return false // Exclude empty or undefined fields
        }
        return true // Include fields with values
      })
    )

    // Submit only the filtered values
    agencyInfoMutation.mutate(filteredValues as UpdateAgencyInfos)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="my-6 w-full max-w-md sm:max-w-3xl">
            <CardContent className="flex flex-col gap-6 p-4">
              <div className="flex w-full flex-col gap-6 pb-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
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
                        <Input placeholder="Enter your surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter district" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="extra"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Extra Information</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter extra information"
                          {...field}
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
                        <Textarea placeholder="Enter agency bio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </div>
              <Button type="submit" className="w-full">
                Update Agency Info
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
