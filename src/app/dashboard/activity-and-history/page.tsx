import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrdersTable from "./components/orders-table"
import NotesLibrary from "./components/notes-library"
import Reviews from "./components/reviews"

export default function ActivityAndHistoryPage({}: Props) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 p-4 md:p-8 lg:p-12">
      <div className="flex flex-col gap-6">
        <h1 className="mb-6 text-center text-xl font-bold md:text-2xl lg:text-3xl">
          Activity & History
        </h1>
      </div>

      <Tabs defaultValue="Recent Orders & Photocopies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 items-center justify-center">
          <TabsTrigger value="Recent Orders & Photocopies">
            Recent Orders & Photocopies
          </TabsTrigger>
          <TabsTrigger value="Reviews and Feedback">
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
