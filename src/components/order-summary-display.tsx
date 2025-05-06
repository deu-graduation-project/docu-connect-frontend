// components/OrderSummaryDisplay.tsx
import React from "react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Control, UseFormSetValue } from "react-hook-form"

type AgencyProduct = {
  productId: string
  paperType: string
  colorOption: string // DB value
  printType: string // DB value
  price: number
}

type ColorOptionLabels = Record<string, { id: string; label: string }>
type PrintStyleLabels = Record<string, string>

type OrderSummaryDisplayProps = {
  control: Control<any>
  setValue: UseFormSetValue<any>
  selectedProduct: AgencyProduct | null
  totalPages: number
  pricePerPage: number
  numPrints: number
  totalPrice: number
  colorOptionLabels: ColorOptionLabels
  printStyleLabels: PrintStyleLabels
  disabled?: boolean
}

export function OrderSummaryDisplay({
  control,
  setValue,
  selectedProduct,
  totalPages,
  pricePerPage,
  numPrints,
  totalPrice,
  colorOptionLabels,
  printStyleLabels,
  disabled = false,
}: OrderSummaryDisplayProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${disabled ? "opacity-50" : ""}`}
    >
      <FormField
        control={control}
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
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  field.onChange(value > 0 ? value : 1)
                }}
                disabled={disabled}
              />
            </FormControl>
            <FormDescription>
              How many copies of this file do you want?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-md border p-4">
        <h3 className="mb-2 font-medium">Order Summary</h3>
        {selectedProduct && !disabled ? (
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Product:</span>
              <span>
                {selectedProduct.paperType} -{" "}
                {colorOptionLabels[selectedProduct.colorOption]?.label ||
                  selectedProduct.colorOption}{" "}
                -{" "}
                {printStyleLabels[selectedProduct.printType] ||
                  selectedProduct.printType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Detected Pages:</span>
              <span>{totalPages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per Page:</span>
              <span>₺{pricePerPage.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of Prints:</span>
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
            {disabled && <p>Please complete all previous selections.</p>}
            {!disabled && !selectedProduct && (
              <p>No matching product found for the selected options.</p>
            )}
            {!disabled &&
              selectedProduct &&
              totalPages === 0 &&
              files.length > 0 && <p>Processing files to count pages...</p>}
            {!disabled &&
              selectedProduct &&
              totalPages === 0 &&
              files.length === 0 && (
                <p>Please upload files to see the price.</p>
              )}
          </div>
        )}
      </div>
    </div>
  )
}
