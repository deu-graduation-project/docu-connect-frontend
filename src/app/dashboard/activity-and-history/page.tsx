import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrdersTable from "./components/orders-table"
import NotesLibrary from "./components/notes-library"
import Reviews from "./components/reviews"

export default function ActivityAndHistoryPage({}: Props) {
  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto grid gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center">
          Activity & History
        </h1>
      </div>

      <Tabs defaultValue="Recent Orders & Photocopies" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TabsTrigger
            value="Recent Orders & Photocopies"
            className="text-sm md:text-base"
          >
            Recent Orders & Photocopies
          </TabsTrigger>
          <TabsTrigger
            value="Reviews and Feedback"
            className="text-sm md:text-base"
          >
            Reviews and Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Recent Orders & Photocopies">
          <div className="space-y-8 py-6">
            <div className="min-w-full">
              <OrdersTable />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Reviews and Feedback">
          <div className="space-y-8 py-6">
            <Reviews />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
