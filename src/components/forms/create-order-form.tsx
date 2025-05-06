"use client"
import React, { useCallback, useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { loadStripe } from "@stripe/stripe-js"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PDFDocument } from "pdf-lib" // Import pdf-lib

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Icons } from "@/components/icons"

// Import services
import { orderService } from "@/services/orders-service"
import { userService } from "@/services/user-service"
import { fileService } from "@/services/file-service"
import useAuthStatus from "@/lib/queries/auth-status"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"

// Import new components
import { FileUpload } from "@/components/file-upload" // Adjust path as needed
import { ProductOptionSelector } from "@/components/product-option-selector" // Adjust path as needed
import { OrderSummaryDisplay } from "@/components/order-summary-display" // Adjust path as needed
import { PaymentButton } from "@/components/payment-button" // Adjust path as needed

// Load Stripe promise outside component
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

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
  fileCode?: string
}

type AgencyProduct = {
  productId: string
  paperType: string
  colorOption: string
  printType: string
  price: number
}

const printStyleLabels: Record<string, string> = {
  TekYuz: "Single Face",
  CiftYuz: "Double-Sided",
}

const colorOptionLabels: Record<string, { id: string; label: string }> = {
  Renkli: { id: "Colored", label: "Colored" },
  SiyahBeyaz: { id: "BlackWhite", label: "Black & White" },
}

const printStyleMap: Record<string, string> = {
  SingleFace: "TekYuz",
  DoubleSided: "CiftYuz",
}

const colorOptionMap: Record<string, string> = {
  Colored: "Renkli",
  BlackWhite: "SiyahBeyaz",
}

export default function CreateOrderForm({ agencyId, fileCode }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [pricePerPage, setPricePerPage] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<AgencyProduct | null>(
    null
  )
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isParsingFiles, setIsParsingFiles] = useState(false)

  const [availablePaperTypes, setAvailablePaperTypes] = useState<
    { id: string; label: string }[]
  >([])
  const [availableColorOptions, setAvailableColorOptions] = useState<
    { id: string; label: string }[]
  >([])
  const [availablePrintStyles, setAvailablePrintStyles] = useState<
    { id: string; label: string }[]
  >([])

  const { data: authData } = useAuthStatus()

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

  const paperSize = form.watch("paperSize")
  const colorOption = form.watch("colorOption")
  const printStyle = form.watch("printStyle")
  const numPrints = form.watch("numPrints")

  useEffect(() => {
    if (fileCode) {
      // handleDownloadFile(fileCode); // Assuming you want this
    }
  }, [fileCode])

  // Actual PDF Parsing
  useEffect(() => {
    form.setValue("files", files)
    if (files.length > 0) {
      setIsParsingFiles(true)
      setTotalPages(0) // Reset while parsing
      form.setValue("numPages", 0)

      const countPages = async () => {
        let total = 0
        for (const file of files) {
          try {
            const arrayBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(arrayBuffer)
            total += pdfDoc.getPageCount()
          } catch (e) {
            console.error("Error parsing PDF:", file.name, e)
            toast.error(
              `Could not parse ${file.name}. It might be corrupted or not a PDF.`
            )
            // Optionally remove the file or mark as unparsable
            // For now, we'll count it as 0 pages if it fails.
          }
        }
        setTotalPages(total)
        form.setValue("numPages", total)
        setIsParsingFiles(false)
      }
      countPages()
    } else {
      setTotalPages(0)
      form.setValue("numPages", 0)
      setIsParsingFiles(false)
    }
  }, [files, form]) // form added to dependency array

  const { data: agencyData, isLoading: isLoadingAgency } = useQuery({
    queryKey: ["AgencyDetails", agencyId],
    queryFn: async () => {
      if (!agencyId) throw new Error("Agency ID is required.")
      return await userService.getSingleAgency(agencyId)
    },
    enabled: !!authData?.userId && !!agencyId,
  })

  useEffect(() => {
    if (agencyData?.agency?.agencyProducts) {
      const uniquePaperTypes = [
        ...new Set(
          agencyData.agency.agencyProducts.map(
            (p: AgencyProduct) => p.paperType
          )
        ),
      ]
      setAvailablePaperTypes(
        uniquePaperTypes.map((pt) => ({ id: pt, label: pt }))
      )
      // Reset dependent fields when agency data or paper types change
      form.resetField("paperSize")
      form.resetField("colorOption")
      form.resetField("printStyle")
      setAvailableColorOptions([])
      setAvailablePrintStyles([])
      setSelectedProduct(null)
    }
  }, [agencyData, form])

  useEffect(() => {
    if (agencyData?.agency?.agencyProducts && paperSize) {
      const matchingProducts = agencyData.agency.agencyProducts.filter(
        (product: AgencyProduct) => product.paperType === paperSize
      )
      const uniqueColorOptions = [
        ...new Set(matchingProducts.map((p) => p.colorOption)),
      ]
      setAvailableColorOptions(
        uniqueColorOptions.map(
          (option) => colorOptionLabels[option] || { id: option, label: option }
        )
      )
      // Reset dependent fields
      form.resetField("colorOption")
      form.resetField("printStyle")
      setAvailablePrintStyles([])
      setSelectedProduct(null)
    } else {
      setAvailableColorOptions([])
    }
  }, [paperSize, agencyData, form])

  useEffect(() => {
    if (agencyData?.agency?.agencyProducts && paperSize && colorOption) {
      const mappedColorOptionVal =
        colorOptionMap[colorOption as keyof typeof colorOptionMap]
      const matchingProducts = agencyData.agency.agencyProducts.filter(
        (product: AgencyProduct) =>
          product.paperType === paperSize &&
          product.colorOption === mappedColorOptionVal
      )
      const uniquePrintTypes = [
        ...new Set(matchingProducts.map((p) => p.printType)),
      ]
      setAvailablePrintStyles(
        uniquePrintTypes.map((type) => {
          const label = printStyleLabels[type] || type
          const id =
            Object.keys(printStyleMap).find(
              (key) => printStyleMap[key as keyof typeof printStyleMap] === type
            ) || type
          return { id, label }
        })
      )
      form.resetField("printStyle")
      setSelectedProduct(null)
    } else {
      setAvailablePrintStyles([])
    }
  }, [paperSize, colorOption, agencyData, form])

  useEffect(() => {
    if (
      agencyData?.agency?.agencyProducts &&
      paperSize &&
      colorOption &&
      printStyle
    ) {
      const mappedColorOptionVal =
        colorOptionMap[colorOption as keyof typeof colorOptionMap]
      const mappedPrintStyleVal =
        printStyleMap[printStyle as keyof typeof printStyleMap]

      const matchingProduct = agencyData.agency.agencyProducts.find(
        (product: AgencyProduct) =>
          product.paperType === paperSize &&
          product.colorOption === mappedColorOptionVal &&
          product.printType === mappedPrintStyleVal
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

  useEffect(() => {
    const calculatedTotalPrice = pricePerPage * totalPages * numPrints
    setTotalPrice(calculatedTotalPrice)
    form.setValue("filePrice", calculatedTotalPrice)
  }, [pricePerPage, totalPages, numPrints, form])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  const initiatePaymentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (
        !selectedProduct ||
        !agencyId ||
        !data.files ||
        data.files.length === 0
      ) {
        throw new Error("Missing required information for payment.")
      }
      setIsProcessingPayment(true)
      try {
        const sessionId = await orderService.initiatePayment(
          agencyId,
          selectedProduct.productId,
          data.numPrints,
          data.files
        )
        return sessionId
      } catch (error) {
        throw error
      }
    },
    onSuccess: async (sessionId: string) => {
      const stripe = await stripePromise
      if (!stripe) {
        toast.error("Stripe.js failed to load.")
        setIsProcessingPayment(false)
        return
      }
      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        console.error("Stripe redirection error:", error)
        toast.error(`Payment failed: ${error.message}`)
      }
      setIsProcessingPayment(false)
    },
    onError: (error) => {
      console.error("Error initiating payment:", error)
      toast.error(
        `Failed to initiate payment: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      setIsProcessingPayment(false)
    },
  })

  function onSubmit(values: FormData) {
    if (isParsingFiles) {
      toast.info("Please wait for files to be processed.")
      return
    }
    if (totalPages === 0 && files.length > 0) {
      toast.error(
        "Some files could not be parsed or have 0 pages. Please check your files."
      )
      return
    }
    const paymentData = {
      ...values,
      numPages: totalPages,
      pricePerPage: pricePerPage,
      filePrice: totalPrice,
    }
    initiatePaymentMutation.mutate(paymentData)
  }

  const isPaperSizeSelected = !!paperSize
  const isColorOptionSelected = isPaperSizeSelected && !!colorOption
  const isPrintStyleSelected = isColorOptionSelected && !!printStyle
  const isProductSelected = !!selectedProduct

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Create Your Print Order</CardTitle>
            <CardDescription>
              Upload PDFs, select options, and proceed to payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload
              files={files}
              onDrop={onDrop}
              removeFile={removeFile}
              control={form.control}
              name="files"
            />

            <ProductOptionSelector
              control={form.control}
              setValue={form.setValue}
              name="paperSize"
              label="Paper Size"
              description="Select from available paper types"
              options={availablePaperTypes}
              currentValue={paperSize}
              disabled={isLoadingAgency || availablePaperTypes.length === 0}
            />

            <ProductOptionSelector
              control={form.control}
              setValue={form.setValue}
              name="colorOption"
              label="Color Option"
              options={availableColorOptions}
              currentValue={colorOption}
              disabled={
                !isPaperSizeSelected || availableColorOptions.length === 0
              }
            />

            <ProductOptionSelector
              control={form.control}
              setValue={form.setValue}
              name="printStyle"
              label="Printing Style"
              description="- Single Face: Printing on one side of the paper.
                           - Double-Sided: Printing on both sides."
              options={availablePrintStyles}
              currentValue={printStyle}
              disabled={
                !isColorOptionSelected || availablePrintStyles.length === 0
              }
            />

            {isParsingFiles && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Analyzing PDF pages...
              </div>
            )}

            <OrderSummaryDisplay
              control={form.control}
              setValue={form.setValue}
              selectedProduct={selectedProduct}
              totalPages={totalPages}
              pricePerPage={pricePerPage}
              numPrints={numPrints}
              totalPrice={totalPrice}
              colorOptionLabels={colorOptionLabels}
              printStyleLabels={printStyleLabels}
              disabled={
                !isPrintStyleSelected || !isProductSelected || isParsingFiles
              }
            />
          </CardContent>
          <CardFooter>
            <PaymentButton
              isProcessing={isProcessingPayment}
              isPending={initiatePaymentMutation.isPending}
              totalPrice={totalPrice}
              disabled={
                isParsingFiles ||
                files.length === 0 ||
                !isPrintStyleSelected ||
                !selectedProduct ||
                totalPages === 0 ||
                isLoadingAgency
              }
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
