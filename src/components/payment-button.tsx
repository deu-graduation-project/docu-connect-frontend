// components/PaymentButton.tsx
import React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ShoppingBag } from "lucide-react"

type PaymentButtonProps = {
  isProcessing: boolean
  isPending: boolean
  disabled: boolean
  totalPrice: number
}

export function PaymentButton({
  isProcessing,
  isPending,
  disabled,
  totalPrice,
}: PaymentButtonProps) {
  const isLoading = isProcessing || isPending
  return (
    <Button
      className="flex w-full items-center gap-3"
      type="submit"
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          Proceed to Payment ({`₺${totalPrice.toFixed(2)}`})
        </>
      )}
    </Button>
  )
}
