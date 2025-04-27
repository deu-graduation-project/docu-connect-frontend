"use client"
import React, { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { X, ShoppingBag } from "lucide-react"
import { productService } from "@/services/products-service"
import useAuthStatus from "@/lib/queries/auth-status"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

// Modified schema - removed numPages, pricePerPage, and filePrice as direct inputs
const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "At least one PDF file is required"),
  paperSize: z.string().min(1, "Paper size is required"),
  colorOption: z.string().min(1, "Color option is required"),
  printStyle: z.string().min(1, "Printing style is required"),
  numPrints: z
    .number()
    .min(1, "At least 1 print is required")
    .max(1000, "Maximum 1000 prints allowed"),
  numPages: z.number().optional(),
  pricePerPage: z.number().optional(),
  filePrice: z.number().optional(),
})

type FormData = z.infer<typeof formSchema>

type Props = {
  agencyId: string
}

export default function CreateOrderForm({ agencyId }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [pricePerPage, setPricePerPage] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const queryClient = useQueryClient()

  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = useAuthStatus()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      paperSize: "",
      colorOption: "",
      printStyle: "",
      numPrints: 1,
      numPages: 0,
      pricePerPage: 0,
      filePrice: 0,
    },
  })

  // Watch form values to calculate prices
  const paperSize = form.watch("paperSize")
  const colorOption = form.watch("colorOption")
  const printStyle = form.watch("printStyle")
  const numPrints = form.watch("numPrints")

  // Set files in form whenever they change
  useEffect(() => {
    form.setValue("files", files)
    // Here we would calculate pages from PDFs
    // This is a mock implementation - in real app, you'd need PDF.js or similar
    if (files.length > 0) {
      // Mock calculation - in reality you'd parse the PDF
      const estimatedPages = files.reduce((total, file) => {
        // Rough estimate based on file size - replace with actual PDF parsing
        const estimatedPagesForFile = Math.max(
          1,
          Math.ceil(file.size / (100 * 1024))
        )
        return total + estimatedPagesForFile
      }, 0)

      setTotalPages(estimatedPages)
      form.setValue("numPages", estimatedPages)
    } else {
      setTotalPages(0)
      form.setValue("numPages", 0)
    }
  }, [files, form])

  // Query for products
  const {
    data: productList,
    isLoading: productListLoading,
    error: productListError,
  } = useQuery({
    queryKey: ["AgencyProducts", agencyId],
    queryFn: () => {
      if (!agencyId) throw new Error("Agency ID is required.")
      return productService.getAgencyProducts(agencyId)
    },
    enabled: !!authData?.userId && !!agencyId,
  })

  // Calculate price per page based on selections
  useEffect(() => {
    if (productList?.agencyProducts && paperSize && colorOption) {
      const selectedProduct = productList.agencyProducts.find(
        (product) => product.paperType === paperSize
      )

      if (selectedProduct) {
        // Base price from the selected product
        let price = selectedProduct.price

        // Apply multipliers based on color option and print style
        if (colorOption === "Colored") {
          // Colored prints might cost more
          price *= 1.5 // Example multiplier
        }

        if (printStyle === "DoubleSided") {
          // Double-sided might be cheaper per page
          price *= 0.85 // Example multiplier
        }

        setPricePerPage(price)
        form.setValue("pricePerPage", price)
      }
    } else {
      setPricePerPage(0)
      form.setValue("pricePerPage", 0)
    }
  }, [productList, paperSize, colorOption, printStyle, form])

  // Calculate total price
  useEffect(() => {
    const calculatedTotalPrice = pricePerPage * totalPages * numPrints
    setTotalPrice(calculatedTotalPrice)
    form.setValue("filePrice", calculatedTotalPrice)
  }, [pricePerPage, totalPages, numPrints, form])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...acceptedFiles]
      return newFiles
    })
  }, [])

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.name !== fileName)
      return newFiles
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  })

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Replace with your actual service call
      // Example: return orderService.addToCart(agencyId, data);
      return Promise.resolve({ success: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Cart"] })
      toast.success("Order added to cart successfully")
      form.reset()
      setFiles([])
      setTotalPages(0)
      setTotalPrice(0)
    },
    onError: () => {
      toast.error("Failed to add order to cart")
    },
  })

  function onSubmit(values: FormData) {
    // Ensure all calculated values are up to date
    const formData = {
      ...values,
      numPages: totalPages,
      pricePerPage: pricePerPage,
      filePrice: totalPrice,
    }

    addToCartMutation.mutate(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload PDF</CardTitle>
            <CardDescription>Drop your PDF files here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem>
                  <div
                    {...getRootProps()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-6 transition hover:bg-muted/20"
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className="text-sm">Drop the PDF here ...</p>
                    ) : (
                      <p className="text-sm">
                        Drag 'n' drop a PDF file here, or click to select one
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show uploaded files */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between gap-2 rounded-md border bg-muted p-2"
                  >
                    <div className="flex items-center justify-start gap-2">
                      <Icons.file className="h-4 w-4" />
                      <p className="text-sm font-medium">{file.name}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => removeFile(file.name)}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            {/* Paper Size */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="paperSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Size</FormLabel>
                    <p className="pb-4 text-xs text-muted-foreground">
                      A3: 29.70 x 42.00 cm. Twice the size of A4.
                      <br />
                      A4: 21.00 x 29.70 cm
                      <br />
                      A5: 14.80 x 21.00 cm. Half the size of A4.
                      <br />
                      A6: 10.50 x 14.80 cm. Half the size of A5.
                    </p>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        {productList?.agencyProducts.map((product) => (
                          <div
                            key={product?.id}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 ${
                              field.value === product.paperType
                                ? "border-primary bg-primary/10"
                                : ""
                            }`}
                            onClick={() =>
                              form.setValue("paperSize", product.paperType)
                            }
                          >
                            <p className="text-sm tracking-tighter text-primary">
                              {product.paperType}
                            </p>
                            <Icons.file
                              strokeWidth={1}
                              className="h-4 w-4 fill-gray-200 stroke-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* Color Option */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="colorOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Option</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "Colored", label: "Colored" },
                          { id: "BlackWhite", label: "Black & White" },
                        ].map((option) => (
                          <div
                            key={option.id}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 ${
                              field.value === option.id
                                ? "border-primary bg-primary/10"
                                : ""
                            }`}
                            onClick={() =>
                              form.setValue("colorOption", option.id)
                            }
                          >
                            <p className="text-sm tracking-tighter text-primary">
                              {option.label}
                            </p>
                            <Icons.file
                              strokeWidth={1}
                              className="h-4 w-4 fill-gray-200 stroke-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* Print Style */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="printStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Printing Style</FormLabel>
                    <p className="pb-4 text-xs text-muted-foreground">
                      - Single Face: Refers to printing on only one side of the
                      paper.
                      <br />- Double-Sided: Refers to printing on both sides
                      (front and back) of the paper.
                    </p>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "SingleFace", label: "Single Face" },
                          { id: "DoubleSided", label: "Double-Sided" },
                        ].map((option) => (
                          <div
                            key={option.id}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 ${
                              field.value === option.id
                                ? "border-primary bg-primary/10"
                                : ""
                            }`}
                            onClick={() =>
                              form.setValue("printStyle", option.id)
                            }
                          >
                            <p className="text-sm tracking-tighter text-primary">
                              {option.label}
                            </p>
                            <Icons.file
                              strokeWidth={1}
                              className="h-4 w-4 fill-gray-200 stroke-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4 bg-muted-foreground" />

            {/* Number of Prints and Order Summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="numPrints"
                render={({ field }) => (
                  <FormItem className="col flex w-full flex-col gap-1.5">
                    <FormLabel htmlFor="numPrints">Number of Prints</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        id="numPrints"
                        placeholder="Enter a number"
                        min={1}
                        max={1000}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      How many copies of this file do you want?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Summary */}
              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Detected Pages:
                    </span>
                    <span>{totalPages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Price per Page:
                    </span>
                    <span>₺{pricePerPage.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Number of Prints:
                    </span>
                    <span>{numPrints}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total Price:</span>
                    <span>₺{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="flex w-full items-center gap-3"
              type="submit"
              disabled={
                addToCartMutation.isPending ||
                files.length === 0 ||
                !paperSize ||
                !colorOption ||
                !printStyle
              }
            >
              {addToCartMutation.isPending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Adding to cart...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Add to the cart
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
