"use client"
import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ShoppingBag, Trash2, Printer, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { orderService } from "@/services/orders-service"

type CartItemType = {
  id: string
  fileName: string
  paperSize: string
  colorOption: string
  printStyle: string
  numPrints: number
  numPages: number
  pricePerPage: number
  filePrice: number
  totalPrice: number
  createdAt: string
  orderCode: string // Added for handling order operations
}

type Props = {
  agencyId: string
}

export default function UserCart({ agencyId }: Props) {
  const queryClient = useQueryClient()

  // Fetch cart items
  const {
    data: cartItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Cart", agencyId],
    queryFn: async () => {
      try {
        // Fetch orders with state "Cart" or equivalent
        const orders = await orderService.getOrders(
          1, // page
          100, // size - adjust as needed
          undefined, // orderCode
          undefined, // search
          undefined, // orderBy
          "Cart" // state - assuming "Cart" is the state for cart items
        )

        // Map to our CartItemType format
        const items = orders.map((order) => {
          // Assuming each order has these properties or can be mapped
          return {
            id: order.id || order.orderId,
            fileName: order.fileNames?.[0] || "document.pdf",
            paperSize: order.paperType || "Unknown",
            colorOption: order.colorOption?.includes("Renkli")
              ? "Colored"
              : "Black & White",
            printStyle: order.printType?.includes("Tek")
              ? "Single Face"
              : "Double-Sided",
            numPrints: order.printCount || 1,
            numPages: order.pageCount || 0,
            pricePerPage: order.price
              ? order.price / ((order.pageCount || 1) * (order.printCount || 1))
              : 0,
            filePrice: order.processingFee || 0,
            totalPrice: order.price || 0,
            createdAt: order.createdAt || new Date().toISOString(),
            orderCode: order.orderCode || "",
          }
        })

        return {
          items: items as CartItemType[],
        }
      } catch (error) {
        console.error("Error fetching cart items:", error)
        throw error
      }
    },
    enabled: !!agencyId,
  })

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (orderCode: string) => {
      // Update the order state to "Cancelled" or equivalent
      return await orderService.updateOrder(
        "Cancelled", // orderState
        orderCode // orderCode
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Cart", agencyId] })
      toast.success("Item removed from cart")
    },
    onError: (error) => {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item")
    },
  })

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      // Process all cart items by changing their state to "Processing" or equivalent
      const promises =
        cartItems?.items.map((item) =>
          orderService.updateOrder(
            "Processing", // orderState
            item.orderCode // orderCode
          )
        ) || []

      return Promise.all(promises)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Cart", agencyId] })
      toast.success("Order placed successfully")
    },
    onError: (error) => {
      console.error("Error during checkout:", error)
      toast.error("Failed to place order")
    },
  })

  const handleRemoveItem = (orderCode: string) => {
    removeItemMutation.mutate(orderCode)
  }

  const handleCheckout = () => {
    if (cartItems?.items?.length) {
      checkoutMutation.mutate()
    } else {
      toast.error("Your cart is empty")
    }
  }

  const calculateTotal = () => {
    if (!cartItems?.items?.length) return 0
    return cartItems.items.reduce((total, item) => total + item.totalPrice, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading cart...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading your cart: {(error as Error).message}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Your Cart
        </CardTitle>
        <CardDescription>
          {cartItems?.items?.length || 0} items in your cart
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!cartItems?.items?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add items to your cart to proceed with checkout
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {cartItems.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-medium">
                            {item.fileName}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{item.paperSize}</Badge>
                          <Badge variant="outline">{item.colorOption}</Badge>
                          <Badge variant="outline">{item.printStyle}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <div>
                            <span className="font-semibold">Prints:</span>{" "}
                            {item.numPrints}
                          </div>
                          <div>
                            <span className="font-semibold">Pages:</span>{" "}
                            {item.numPages}
                          </div>
                          <div>
                            <span className="font-semibold">Price/Page:</span> ₺
                            {item.pricePerPage.toFixed(2)}
                          </div>
                          <div>
                            <span className="font-semibold">File Price:</span> ₺
                            {item.filePrice.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-4">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveItem(item.orderCode)}
                          disabled={removeItemMutation.isPending}
                        >
                          {removeItemMutation.isPending ? (
                            <Icons.spinner className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                        <p className="text-lg font-bold">
                          ₺{item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      {cartItems?.items?.length > 0 && (
        <>
          <Separator />
          <CardFooter className="flex flex-col space-y-4 p-4">
            <div className="flex w-full items-center justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="text-xl font-bold">
                ₺{calculateTotal().toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Printer className="mr-2 h-4 w-4" />
                  Checkout
                </>
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
