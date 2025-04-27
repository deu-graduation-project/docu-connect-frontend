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
      // Replace with your actual service call
      // Example: return cartService.getCartItems(agencyId);

      // Mock data for demonstration
      return {
        items: [
          {
            id: "1",
            fileName: "document.pdf",
            paperSize: "A4",
            colorOption: "Colored",
            printStyle: "Double-Sided",
            numPrints: 2,
            numPages: 10,
            pricePerPage: 0.5,
            filePrice: 1.0,
            totalPrice: 11.0, // (numPrints * numPages * pricePerPage) + filePrice
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            fileName: "presentation.pdf",
            paperSize: "A3",
            colorOption: "Black & White",
            printStyle: "Single Face",
            numPrints: 1,
            numPages: 20,
            pricePerPage: 0.3,
            filePrice: 0.5,
            totalPrice: 6.5, // (numPrints * numPages * pricePerPage) + filePrice
            createdAt: new Date().toISOString(),
          },
        ] as CartItemType[],
      }
    },
  })

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      // Replace with your actual service call
      // Example: return cartService.removeItem(agencyId, itemId);
      return Promise.resolve({ success: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Cart"] })
      toast.success("Item removed from cart")
    },
    onError: () => {
      toast.error("Failed to remove item")
    },
  })

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      // Replace with your actual service call
      // Example: return orderService.checkout(agencyId);
      return Promise.resolve({ success: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Cart"] })
      toast.success("Order placed successfully")
    },
    onError: () => {
      toast.error("Failed to place order")
    },
  })

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId)
  }

  const handleCheckout = () => {
    checkoutMutation.mutate()
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
        Error loading your cart
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
          <ScrollArea className="h-[400px] pr-4">
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
                          onClick={() => handleRemoveItem(item.id)}
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
