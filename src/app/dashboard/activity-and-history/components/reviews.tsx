import React from "react";
import { Star, PlusIcon, ImageIcon, EditIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  agencyName: string;
  rating: number;
  date: string;
  reviewText: string;
  editable: boolean;
  image?: string;
};

const submittedReviews: Review[] = [
  {
    id: "1",
    agencyName: "agency 1",
    rating: 5,
    date: "2024-12-15",
    reviewText: "Excellent service and fast business",
    editable: true,
    image: "",
  },
  {
    id: "2",
    agencyName: "agency 2",
    rating: 4,
    date: "2024-12-10",
    reviewText:
      "Had a great experience but the photocopy quality could be better.",
    editable: false,
  },
];

const pendingReviews = [
  {
    id: "101",
    agencyName: "agency 3",
    orderId: "ORD-895",
  },
];

export default function Reviews() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8"></div>

      {/* Submitted Reviews Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Submitted Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {submittedReviews.map((review) => (
            <div key={review.id} className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{review.agencyName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Reviewed on {review.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={cn(
                        "text-muted-foreground",
                        index < review.rating ? "text-yellow-500" : ""
                      )}
                    />
                  ))}
                </div>
              </div>

              <Textarea
                defaultValue={review.reviewText}
                readOnly={!review.editable}
                className="mt-4 resize-none"
              />

              {/* Review Actions */}
              <div className="flex items-center justify-between mt-4">
                {review.editable ? (
                  <Button size="sm" className="flex items-center gap-2">
                    <EditIcon size={14} />
                    Update Review
                  </Button>
                ) : (
                  <Badge variant="outline">Review Locked</Badge>
                )}

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <ImageIcon size={16} />
                    {review.image ? "Replace Photo" : "Add Photo"}
                  </Button>
                  {review.image && (
                    <img
                      src={review.image}
                      alt="Uploaded"
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>

              <Separator className="my-6" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReviews.length > 0 ? (
            pendingReviews.map((order) => (
              <div
                key={order.id}
                className="mb-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{order.agencyName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Order ID: {order.orderId}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <PlusIcon size={14} />
                  Leave Feedback
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              No pending reviews at the moment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
