import React from "react"
import {
  Star,
  EditIcon,
  SendIcon,
  MessageCircleWarning,
  ServerCrash,
} from "lucide-react" // Added new icons
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card" // Added CardDescription
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton" // For loading state
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { userService } from "@/services/user-service" // Assuming this service fetches agency data including comments

// Define the type for a single comment based on your API response
type Comment = {
  commentText: string
  createdDate: string // This will be a string date, needs formatting
  starRating: string // This is a string in your console log, needs parsing
  userName: string
  // Add other fields if they exist, e.g., orderCode, commentId
  orderCode?: string // Optional: if you want to link back to an order
}

// Dummy data for pending reviews (kept as is, assuming it's for a different feature)
const pendingReviews = [
  {
    id: "101",
    agencyName: "agency 3",
    orderId: "ORD-895",
  },
]

// Helper function to format date strings
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    console.error("Failed to format date:", e)
    return "Invalid Date"
  }
}

export default function Reviews() {
  const { data: authStatus } = useAuthStatus()

  // Fetch agency data which includes comments
  const {
    data: agencyDataResponse, // Renamed for clarity
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agencyDetailsWithComments", authStatus?.userId], // More specific query key
    queryFn: () => {
      if (!authStatus?.userId) {
        // This should ideally be handled by `enabled` but good as a safeguard
        return Promise.reject(
          new Error("User ID is not available for fetching agency details.")
        )
      }
      return userService.getSingleAgency(authStatus.userId) // This fetches the agency object
    },
    enabled: !!authStatus?.userId, // Query only runs if userId is available
  })

  // Extract comments from the fetched data
  const comments: Comment[] = agencyDataResponse?.agency?.comments || []

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Submitted Reviews</CardTitle>
            <CardDescription>Loading customer feedback...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-20 w-full" />
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-10 text-center">
        <ServerCrash className="mb-4 h-16 w-16 text-destructive" />
        <h2 className="mb-2 text-2xl font-semibold">Error Loading Reviews</h2>
        <p className="mb-4 text-muted-foreground">
          We couldn't fetch the reviews at this time. Please try again later.
        </p>
        <p className="text-sm text-red-500">
          {(error as Error)?.message || "An unknown error occurred."}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      {/* Submitted Reviews Section - Now uses real data */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            Here's what customers are saying about your agency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            comments.map((comment, index) => {
              // Parse starRating to a number. Handle potential errors.
              const rating = parseInt(comment.starRating, 10)
              const isValidRating = !isNaN(rating) && rating >= 0 && rating <= 5

              return (
                <div
                  key={comment.createdDate + comment.userName + index}
                  className="mb-6"
                >
                  {" "}
                  {/* Improved key */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {/* Displaying userName as the reviewer's name */}
                      <h3 className="text-lg font-semibold">
                        {comment.userName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reviewed on {formatDate(comment.createdDate)}
                      </p>
                    </div>
                    {isValidRating && (
                      <div className="mt-2 flex items-center gap-1 sm:mt-0">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            size={18}
                            className={cn(
                              "text-gray-300", // Default to muted
                              starIndex < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : ""
                            )}
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({rating}/5)
                        </span>
                      </div>
                    )}
                  </div>
                  <Textarea
                    value={comment.commentText} // Use value for controlled component if needed, or defaultValue
                    readOnly // Reviews are not editable by the agency in this view
                    className="mt-4 min-h-[80px] resize-none border bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {/* Removed editable actions and image upload as they are not in the API data */}
                  {/* You can add "Reply" functionality here in the future if needed */}
                  {index < comments.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <MessageCircleWarning className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Reviews Yet</h3>
              <p className="text-muted-foreground">
                Customers haven't left any reviews for your agency yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
