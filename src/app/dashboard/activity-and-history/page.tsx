import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrdersTable from "./components/orders-table"
import NotesLibrary from "./components/notes-library"
import Reviews from "./components/reviews"

export default function ActivityAndHistoryPage({}: Props) {
  return (
    <div className="container mx-auto w-full max-w-7xl p-4">
      <Tabs
        defaultValue="Recent Orders & Photocopies"
        className="w-full max-w-7xl"
      >
        <TabsList className="w-auto">
          <TabsTrigger value="Recent Orders & Photocopies">
            Recent Orders & Photocopies
          </TabsTrigger>
          <div className="mx-1 h-full w-[1px] bg-primary-foreground"></div>
          <TabsTrigger value="Reviews and Feedback">
            Reviews and Feedback
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Recent Orders & Photocopies">
          <OrdersTable />
        </TabsContent>
        
        <TabsContent value="Reviews and Feedback">
          <Reviews />
        </TabsContent>
      </Tabs>
    </div>
  )
}
