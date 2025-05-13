import React from "react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface OrderTimelineProps {
  orderStates: Array<{
    state: string
    timestamp: string
    description?: string
  }>
}

export function OrderTimeline({ orderStates }: OrderTimelineProps) {
  // Define color and icon mappings for different states
  const getStateDetails = (state: string) => {
    switch (state.toLowerCase()) {
      case "pending":
        return {
          color: "bg-yellow-500",
          icon: <Icons.clock className="h-4 w-4 text-yellow-700" />,
        }
      case "confirmed":
        return {
          color: "bg-blue-500",
          icon: <Icons.checkCircle className="h-4 w-4 text-blue-700" />,
        }
      case "started":
        return {
          color: "bg-purple-500",
          icon: <Icons.play className="h-4 w-4 text-purple-700" />,
        }
      case "finished":
        return {
          color: "bg-teal-500",
          icon: <Icons.check className="h-4 w-4 text-teal-700" />,
        }
      case "completed":
        return {
          color: "bg-green-500",
          icon: <Icons.checkCircle2 className="h-4 w-4 text-green-700" />,
        }
      case "rejected":
        return {
          color: "bg-red-500",
          icon: <Icons.xCircle className="h-4 w-4 text-red-700" />,
        }
      default:
        return {
          color: "bg-gray-500",
          icon: <Icons.help className="h-4 w-4 text-gray-700" />,
        }
    }
  }

  return (
    <div className="space-y-3">
      {orderStates.map((state, index) => {
        const { color, icon } = getStateDetails(state.state)

        return (
          <div
            key={index}
            className="flex items-center space-x-3 rounded-md border p-3"
          >
            <div className={cn("h-2 w-2 rounded-full", color)}></div>
            <div className="flex flex-1 items-center space-x-2">
              <div className="flex-shrink-0">{icon}</div>
              <div>
                <p className="font-medium capitalize">{state.state}</p>
                <p className="text-xs text-muted-foreground">
                  {state.description ||
                    `Order status changed to ${state.state}`}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(state.timestamp).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )
      })}
    </div>
  )
}
