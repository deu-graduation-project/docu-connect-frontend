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
import { orderService } from "@/services/orders-service"
import { userService } from "@/services/user-service"
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
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
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
    // Calculate pages from PDFs
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

  // Query for agency products
  const {
    data: agencyData,
    isLoading: agencyLoading,
    error: agencyError,
  } = useQuery({
    queryKey: ["AgencyDetails", agencyId],
    queryFn: async () => {
      if (!agencyId) throw new Error("Agency ID is required.")
      return await userService.getSingleAgency(agencyId)
    },
    enabled: !!authData?.userId && !!agencyId,
  })

  // Map print style labels to values in the database
  const printStyleMap = {
    SingleFace: "TekYuz",
    DoubleSided: "CiftYuz",
  }

  // Map color option labels to values in the database
  const colorOptionMap = {
    Colored: "Renkli",
    BlackWhite: "SiyahBeyaz",
  }

  // Find matching product based on selections
  useEffect(() => {
    if (
      agencyData?.agency?.agencyProducts &&
      paperSize &&
      colorOption &&
      printStyle
    ) {
      const mappedColorOption =
        colorOptionMap[colorOption as keyof typeof colorOptionMap]
      const mappedPrintStyle =
        printStyleMap[printStyle as keyof typeof printStyleMap]

      // Find the product that matches all our criteria
      const matchingProduct = agencyData.agency.agencyProducts.find(
        (product) =>
          product.paperType === paperSize &&
          product.colorOption === mappedColorOption &&
          product.printType === mappedPrintStyle
      )

      if (matchingProduct) {
        setSelectedProduct(matchingProduct)
        setPricePerPage(matchingProduct.price)
        form.setValue("pricePerPage", matchingProduct.price)
      } else {
        setSelectedProduct(null)
        setPricePerPage(0)
        form.setValue("pricePerPage", 0)
      }
    } else {
      setSelectedProduct(null)
      setPricePerPage(0)
      form.setValue("pricePerPage", 0)
    }
  }, [agencyData, paperSize, colorOption, printStyle, form])

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

  // Update the addToCartMutation in your CreateOrderForm component
  console.log(
    "Agency ID:",
    agencyId,
    "Selected Product:",
    selectedProduct,
    "Files:",
    files,
    "Total Pages:",
    totalPages,
    "Price Per Page:",
    pricePerPage,
    "Total Price:",
    totalPrice
  )
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!selectedProduct || !agencyId) {
        throw new Error("Missing product or agency information")
      }

      try {
        // Use the order service to create the order
        return await orderService.createOrder(
          selectedProduct.productId, // The selected product's ID
          agencyId, // The agency ID
          data.numPrints, // Number of copies
          data.files // PDF files
        )
      } catch (error) {
        // Check if the error is related to email sending
        if (
          error instanceof Error &&
          error.message.includes("ArgumentNullException") &&
          error.message.includes("Value cannot be null") &&
          error.message.includes("MailService")
        ) {
          // More specific error message for email issue
          throw new Error(
            "The order could not be created due to an email service error. The agency may not have a valid email address set up."
          )
        }
        // Re-throw other errors
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate Cart query to refresh the cart data
      queryClient.invalidateQueries({ queryKey: ["Cart", agencyId] })
      toast.success("Order added to cart successfully")
      form.reset()
      setFiles([])
      setTotalPages(0)
      setTotalPrice(0)
    },
    onError: (error) => {
      console.error("Error adding to cart:", error)
      // Display more user-friendly error message
      if (error instanceof Error) {
        toast.error(`Failed to add order to cart: ${error.message}`)
      } else {
        toast.error("Failed to add order to cart. Please try again later.")
      }
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

  // Get unique paper types from agency products
  const paperTypes = agencyData?.agency?.agencyProducts
    ? [...new Set(agencyData.agency.agencyProducts.map((p) => p.paperType))]
    : []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full">
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
            <div className="w-full space-y-2">
              <FormField
                control={form.control}
                name="paperSize"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Paper Size</FormLabel>
                    <p className="pb-4 text-xs text-muted-foreground">
                      Select from available paper types
                    </p>
                    <FormControl>
                      <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-3">
                        {paperTypes.map((paperType) => (
                          <div
                            key={paperType}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border p-2 ${
                              field.value === paperType
                                ? "border-primary bg-primary/10"
                                : ""
                            }`}
                            onClick={() =>
                              form.setValue("paperSize", paperType)
                            }
                          >
                            <p className="text-sm tracking-tighter text-primary">
                              {paperType}
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
                      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
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
            <div className="w-full space-y-2">
              <FormField
                control={form.control}
                name="printStyle"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Printing Style</FormLabel>
                    <p className="pb-4 text-xs text-muted-foreground">
                      - Single Face: Refers to printing on only one side of the
                      paper.
                      <br />- Double-Sided: Refers to printing on both sides
                      (front and back) of the paper.
                    </p>
                    <FormControl>
                      <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-3">
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
                {selectedProduct ? (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Selected Product:
                      </span>
                      <span>
                        {selectedProduct.paperType} -{" "}
                        {selectedProduct.colorOption} -{" "}
                        {selectedProduct.printType}
                      </span>
                    </div>
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
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {paperSize && colorOption && printStyle ? (
                      <p>No matching product found for the selected options.</p>
                    ) : (
                      <p>Please select all options to see pricing details.</p>
                    )}
                  </div>
                )}
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
                !printStyle ||
                !selectedProduct
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
