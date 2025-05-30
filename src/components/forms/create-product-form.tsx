"use client"
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
import { Icons } from "../icons"

import { Card, CardContent } from "@/components/ui/card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { productService } from "@/services/products-service"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Product = {
  id: string
  colorOption: string
  paperType: string
  printType: string
}

type FormData = z.infer<typeof formSchema>

const formSchema = z.object({
  paperType: z.string().min(1, "Paper type is required"),
  colorOption: z.string().min(1, "Color option is required"),
  printType: z.string().min(1, "Print type is required"),
})

const paperTypeOptions = ["A3", "A4", "A5", "A6"]

// Define options with display labels and backend values
const colorOptionsMap = [
  { label: "Siyah/Beyaz", value: "SiyahBeyaz" },
  { label: "Renkli", value: "Renkli" },
]

const printTypeOptionsMap = [
  { label: "Tek Yüz", value: "TekYuz" },
  { label: "Çift Yüz", value: "CiftYuz" },
]

export default function CreateProductForm() {
  const queryClient = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paperType: "",
      colorOption: "",
      printType: "",
    },
  })

  // Fetch existing products to check for duplicates
  const { data } = useQuery({
    queryKey: ["viewCreatedProducts"],
    queryFn: () => productService.getProducts(0, 20),
  })

  const existingProducts: Product[] =
    data?.products.map((product: any) => ({
      id: product.id,
      colorOption: product.colorOption,
      paperType: product.paperType,
      printType: product.printType,
    })) || []

  const createProductMutation = useMutation({
    mutationFn: async (values: FormData): Promise<unknown> => {
      // Check if product already exists
      const isDuplicate = existingProducts.some(
        (product) =>
          product.paperType === values.paperType &&
          product.colorOption === values.colorOption &&
          product.printType === values.printType
      )

      if (isDuplicate) {
        throw new Error("This product already exists")
      }

      return productService.createProduct(
        values.paperType,
        values.colorOption,
        values.printType
      )
    },
    onSuccess: () => {
      // Directly invalidate the exact query key used in the product list component
      queryClient.invalidateQueries({
        queryKey: ["viewCreatedProducts"],
      })

      // Force refetch to ensure the data is updated immediately
      queryClient.refetchQueries({
        queryKey: ["viewCreatedProducts"],
      })

      toast.success("Product created successfully")

      // Reset the form completely
      form.reset({
        paperType: "",
        colorOption: "",
        printType: "",
      })
    },
    onError: (error: { message: string }) => {
      toast.error(error.message)
    },
  })

  function onSubmit(values: FormData) {
    createProductMutation.mutate(values)
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <Card className="w-full">
            <CardContent className="flex flex-col gap-6 p-4">
              <div className="flex w-full flex-col gap-6 pb-4">
                <FormField
                  control={form.control}
                  name="paperType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Paper Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select paper type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paperTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colorOption"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Color Option</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorOptionsMap.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="printType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Print Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select print type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {printTypeOptionsMap.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
